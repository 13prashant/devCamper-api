const asyncHandler = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder')
const Bootcamp = require('../models/Bootcamp')

// @desc        Get all
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find()

    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps })
})

// @desc        Get single bootcapm
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
        return next(new ErrorResponse(`Resource not found with the id of ${req.params.id}!`, 404))
    }

    res.status(200).json({ success: true, data: bootcamp })
})

// @desc        Create new bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body)

    res.status(201).json({
        success: true,
        msg: bootcamp
    })
})

// @desc        Update bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!bootcamp) {
        return next(new ErrorResponse(`Resource not found with the id of ${req.params.id}!`, 404))
    }
    res.status(200).json({ success: true, data: bootcamp })
})

// @desc        Delete bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if (!bootcamp) {
        return next(new ErrorResponse(`Resource not found with the id of ${req.params.id}!`, 404))
    }
    res.status(200).json({ success: true, data: {} })
})

// @desc        Get bootcamp within a radius
// @route       GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access      Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params

    // Get longitude and latitude
    const loc = await geocoder.geocode(zipcode)
    const lng = loc[0].longitude
    const ltd = loc[0].latitude

    // Divide distance by earth's radius
    // Earth radius = 3963 mi
    const radius = distance / 3963

    const bootcamps = await Bootcamp.find({ location: { $geoWithin: { $centerSphere: [[lng, ltd], radius] } } })

    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps })
})
