import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Offer from '../models/Offer.js';
import Quiz from '../models/Quiz.js';
import QuizSubmission from '../models/QuizSubmission.js';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/analytics/overview
// Access: College only
// ─────────────────────────────────────────────────────────────────────────────
export const getOverviewAnalytics = async (req, res) => {
  try {
    const collegeId = req.user.id;

    // Get all students belonging to this college
    const collegeStudents = await User.find({ role: 'Student', collegeId }).select('_id');
    const studentIds = collegeStudents.map(s => s._id);

    // Parallel DB queries for efficiency
    const [
      totalStudents,
      eligibleStudents,
      totalJobs,
      approvedJobs,
      totalApplications,
      selectedStudents,
      totalOffers,
      acceptedOffers,
      packageStats,
    ] = await Promise.all([
      User.countDocuments({ role: 'Student', collegeId }),
      StudentProfile.countDocuments({ userId: { $in: studentIds }, approvedForPlacement: true }),
      Job.countDocuments({ targetColleges: collegeId }),
      Job.countDocuments({ targetColleges: collegeId, approvedByColleges: collegeId }),
      Application.countDocuments({ studentId: { $in: studentIds } }),
      Application.countDocuments({ studentId: { $in: studentIds }, status: 'selected' }),
      Offer.countDocuments({ studentId: { $in: studentIds } }),
      Offer.countDocuments({ studentId: { $in: studentIds }, status: 'accepted' }),
      Offer.aggregate([
        { $match: { studentId: { $in: studentIds }, status: 'accepted' } },
        {
          $group: {
            _id: null,
            averagePackage: { $avg: '$package' },
            highestPackage: { $max: '$package' },
            lowestPackage: { $min: '$package' },
          },
        },
      ]),
    ]);

    const placementPercentage =
      eligibleStudents > 0
        ? parseFloat(((selectedStudents / eligibleStudents) * 100).toFixed(2))
        : 0;

    const averagePackage =
      packageStats.length > 0
        ? parseFloat(packageStats[0].averagePackage.toFixed(2))
        : 0;

    const highestPackage =
      packageStats.length > 0 ? packageStats[0].highestPackage : 0;

    const lowestPackage =
      packageStats.length > 0 ? packageStats[0].lowestPackage : 0;

    res.status(200).json({
      success: true,
      analytics: {
        students: {
          total: totalStudents,
          eligible: eligibleStudents,
          selected: selectedStudents,
          placementPercentage,
        },
        jobs: {
          total: totalJobs,
          approved: approvedJobs,
        },
        applications: {
          total: totalApplications,
        },
        offers: {
          total: totalOffers,
          accepted: acceptedOffers,
          pending: totalOffers - acceptedOffers,
        },
        packages: {
          average: averagePackage,
          highest: highestPackage,
          lowest: lowestPackage,
        },
      },
    });
  } catch (error) {
    console.error('Get overview analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/analytics/branch-wise
// Access: College only
// ─────────────────────────────────────────────────────────────────────────────
export const getBranchWiseAnalytics = async (req, res) => {
  try {
    const collegeId = req.user.id;
    const collegeStudents = await User.find({ role: 'Student', collegeId }).select('_id');
    const studentIds = collegeStudents.map(s => s._id);

    /*
     * Strategy:
     *  1. Group StudentProfiles by branch to get per-branch student counts.
     *  2. Join Applications (to count "selected" status per branch).
     *  3. Join Offers via Applications → but since Offers reference studentId
     *     directly, we $lookup offers on StudentProfile.userId and then
     *     $unwind + filter to avoid the nested-array $avg bug.
     *
     *  The accepted-offer packages are collected as an array and then
     *  $avg / $max are applied in a second $group.
     */
    const branchStats = await StudentProfile.aggregate([
      // ── Step 0: Filter down to just this college's students ──────────────
      { $match: { userId: { $in: studentIds } } },
      // ── Step 1: Join offers on this student ──────────────────────────────
      {
        $lookup: {
          from: 'offers',
          localField: 'userId',
          foreignField: 'studentId',
          as: 'studentOffers',
        },
      },
      // ── Step 2: Join applications on this student ─────────────────────────
      {
        $lookup: {
          from: 'applications',
          localField: 'userId',
          foreignField: 'studentId',
          as: 'studentApplications',
        },
      },
      // ── Step 3: Compute per-student flags ─────────────────────────────────
      {
        $addFields: {
          isSelected: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: '$studentApplications',
                    cond: { $eq: ['$$this.status', 'selected'] },
                  },
                },
              },
              0,
            ],
          },
          acceptedOfferPackages: {
            $map: {
              input: {
                $filter: {
                  input: '$studentOffers',
                  cond: { $eq: ['$$this.status', 'accepted'] },
                },
              },
              in: '$$this.package',
            },
          },
          offersReceivedCount: { $size: '$studentOffers' },
          offersAcceptedCount: {
            $size: {
              $filter: {
                input: '$studentOffers',
                cond: { $eq: ['$$this.status', 'accepted'] },
              },
            },
          },
        },
      },
      // ── Step 4: Group by branch ───────────────────────────────────────────
      {
        $group: {
          _id: '$branch',
          totalStudents: { $sum: 1 },
          eligibleStudents: {
            $sum: { $cond: ['$approvedForPlacement', 1, 0] },
          },
          placedStudents: {
            $sum: { $cond: ['$isSelected', 1, 0] },
          },
          offersReceived: { $sum: '$offersReceivedCount' },
          offersAccepted: { $sum: '$offersAcceptedCount' },
          // Collect all accepted packages per branch as a flat array
          allAcceptedPackages: { $push: '$acceptedOfferPackages' },
        },
      },
      // ── Step 5: Flatten the nested arrays of packages ─────────────────────
      {
        $addFields: {
          // $reduce flattens [[p1,p2],[p3]] → [p1,p2,p3]
          flatPackages: {
            $reduce: {
              input: '$allAcceptedPackages',
              initialValue: [],
              in: { $concatArrays: ['$$value', '$$this'] },
            },
          },
        },
      },
      // ── Step 6: Compute derived stats ────────────────────────────────────
      {
        $addFields: {
          averagePackage: {
            $cond: {
              if: { $gt: [{ $size: '$flatPackages' }, 0] },
              then: { $avg: '$flatPackages' },
              else: 0,
            },
          },
          highestPackage: {
            $cond: {
              if: { $gt: [{ $size: '$flatPackages' }, 0] },
              then: { $max: '$flatPackages' },
              else: 0,
            },
          },
          placementPercentage: {
            $cond: {
              if: { $gt: ['$eligibleStudents', 0] },
              then: {
                $multiply: [
                  { $divide: ['$placedStudents', '$eligibleStudents'] },
                  100,
                ],
              },
              else: 0,
            },
          },
        },
      },
      // ── Step 7: Shape the output ─────────────────────────────────────────
      {
        $project: {
          _id: 0,
          branch: '$_id',
          totalStudents: 1,
          eligibleStudents: 1,
          placedStudents: 1,
          offersReceived: 1,
          offersAccepted: 1,
          placementPercentage: 1,
          averagePackage: 1,
          highestPackage: 1,
        },
      },
      { $sort: { placementPercentage: -1 } },
    ]);

    // Round floating-point values for a clean response
    const formattedStats = branchStats.map((stat) => ({
      ...stat,
      placementPercentage: parseFloat(stat.placementPercentage.toFixed(2)),
      averagePackage: parseFloat(stat.averagePackage.toFixed(2)),
    }));

    res.status(200).json({
      success: true,
      count: formattedStats.length,
      branchStats: formattedStats,
    });
  } catch (error) {
    console.error('Get branch-wise analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/analytics/job/:jobId
// Access: Recruiter only (must own the job)
// ─────────────────────────────────────────────────────────────────────────────
export const getJobAnalytics = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Verify job exists and belongs to this recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view analytics for this job',
      });
    }

    // Fetch applications and offers in parallel
    const [applications, offers] = await Promise.all([
      Application.find({ jobId }).populate('studentId', 'name email'),
      Offer.find({ jobId }).populate('studentId', 'name email'),
    ]);

    // Application funnel
    const totalApplications = applications.length;
    const shortlisted = applications.filter(
      (a) => a.status === 'shortlisted'
    ).length;
    const selected = applications.filter((a) => a.status === 'selected').length;
    const rejectedApplications = applications.filter(
      (a) => a.status === 'rejected'
    ).length;

    // Offer funnel
    const totalOffers = offers.length;
    const pendingOffers = offers.filter((o) => o.status === 'pending').length;
    const acceptedOffers = offers.filter((o) => o.status === 'accepted').length;
    const rejectedOffers = offers.filter((o) => o.status === 'rejected').length;

    // Package stats (accepted offers only)
    const acceptedPackages = offers
      .filter((o) => o.status === 'accepted')
      .map((o) => o.package);

    const averagePackage =
      acceptedPackages.length > 0
        ? parseFloat(
            (
              acceptedPackages.reduce((sum, p) => sum + p, 0) /
              acceptedPackages.length
            ).toFixed(2)
          )
        : 0;

    const highestPackage =
      acceptedPackages.length > 0 ? Math.max(...acceptedPackages) : 0;

    const lowestPackage =
      acceptedPackages.length > 0 ? Math.min(...acceptedPackages) : 0;

    // Quiz stats (if a quiz exists for this job)
    const quiz = await Quiz.findOne({ jobId, approvedByCollege: true }).select('_id');
    const quizSubs = quiz
      ? await QuizSubmission.find({ quizId: quiz._id }).select('passed')
      : [];
    const quizPassed = quizSubs.filter(s => s.passed).length;
    const quizTotal = quizSubs.length;

    res.status(200).json({
      success: true,
      job: {
        id: job._id,
        title: job.title,
        company: job.company,
        approvedByCollege: job.approvedByCollege,
      },
      // Backward-compatible top-level fields used by frontend
      totalApplications,
      shortlisted,
      selected,
      offerStats: {
        totalOffers,
        pending: pendingOffers,
        accepted: acceptedOffers,
        rejected: rejectedOffers,
      },
      quizStats: {
        totalSubmissions: quizTotal,
        passed: quizPassed,
        failed: quizTotal - quizPassed,
      },
      analytics: {
        applications: {
          total: totalApplications,
          shortlisted,
          selected,
          rejected: rejectedApplications,
          conversionRate:
            totalApplications > 0
              ? parseFloat(
                  ((selected / totalApplications) * 100).toFixed(2)
                )
              : 0,
        },
        offers: {
          total: totalOffers,
          pending: pendingOffers,
          accepted: acceptedOffers,
          rejected: rejectedOffers,
        },
        packages: {
          average: averagePackage,
          highest: highestPackage,
          lowest: lowestPackage,
        },
      },
      applications: applications.map((app) => ({
        id: app._id,
        student: {
          id: app.studentId._id,
          name: app.studentId.name,
          email: app.studentId.email,
        },
        status: app.status,
        appliedAt: app.appliedAt,
      })),
      offers: offers.map((offer) => ({
        id: offer._id,
        student: {
          id: offer.studentId._id,
          name: offer.studentId.name,
          email: offer.studentId.email,
        },
        package: offer.package,
        joiningDate: offer.joiningDate,
        status: offer.status,
        issuedAt: offer.issuedAt,
      })),
    });
  } catch (error) {
    console.error('Get job analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};