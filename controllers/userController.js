const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
// const Tour = require('./../models/tourModel');
// const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./../controllers/handlerFactory');



// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
  
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);
  
    next();
  });

const filterObj = (obj, ...allowedFields) => {
    const newObj = {} ;
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj ; 
}

exports.getAllUsers = factory.getAll(User)

exports.getMe = (req , res , next) => {
    req.params.id = req.user.id;
    next();
}

exports.updateMe = catchAsync(async (req , res , next) => {
    // console.log(req.file)
    // console.log(req.body);

    //1)create error if user posts password data
    if(req.body.password || req.body.passwordConfirm){
        return next(
            new AppError('this route is not for password update please use update password ' , 400)
        )
    }
    //2) filter out unwanted fields name that are not allowed to be updated
    const filterBody = filterObj(req.body , 'email' , 'name')
    if (req.file) filterBody.photo = req.file.filename;
   
   
    //2)update user document    
    const updateUser = await User.findByIdAndUpdate(req.user.id , filterBody , {
        new : true ,
        runValidators : true 
    })
    res.status(200).json({
        status : "success",
        data : {
            user : updateUser
        }
    })
}) 

exports.deleteMe = catchAsync( async (req , res ,next)=> {
    await User.findByIdAndUpdate(req.user.id , {active : false })

    res.status(204).json({
        status : "success" ,
        data : null
    })
})

exports.getUser = factory.getOne(User);

exports.createUser = (req , res , next) => {
    res.status(500).json({
        status : "Error",
        message:"<This Route is not defined yet ......>"
    })
};

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);