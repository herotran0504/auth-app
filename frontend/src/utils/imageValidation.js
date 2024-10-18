export const validateImage = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const errors = [];

    if (!file) {
        errors.push('No file selected. Please upload an image.');
        return errors;
    }

    if (!validTypes.includes(file.type)) {
        errors.push('Invalid file type. Please upload an image file (JPG, PNG, GIF).');
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
        errors.push('File size must be less than 2MB. Please select a smaller file.');
    }

    return errors;
};
