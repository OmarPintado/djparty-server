export const imageFilterHelper = (
    req: Express.Request,
    file: Express.Multer.File,
    callback: Function,
) => {
    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if (validExtensions.includes(fileExtension)) {
        return callback(null, true);
    }

    return callback(new Error('Only image files are allowed!'), false);
};
