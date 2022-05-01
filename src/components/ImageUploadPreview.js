import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from "uuid";
import FirebaseStorageService from "../FirebaseStorageService";
const ImageUploadPreview = ({
    basePath,
    existingImageUrl,
    handleUploadFinish,
    handleUploadCancel
}) => {
    const [uploadProgress, setUploadProgress] = useState(-1)//daha upload a başlamdık
    const [imageUrl, setImageUrl] = useState("");
    const fileInputRef = useRef();

    const handleFileChanged = async (e) => {
        try {
            const files = e.target.files;
            const file = files[0];
            if (!file) {
                alert("File Select Failed.Please try again.");
                return;
            }
            const generatedFileId = uuidv4();
            const downloadUrl = await FirebaseStorageService.uploadFile(file, `${basePath}/${generatedFileId}`, setUploadProgress);
            setImageUrl(downloadUrl);
            console.log(imageUrl);
            console.log(downloadUrl)
            handleUploadFinish(downloadUrl);
        } catch (error) {
            setUploadProgress(-1);
            fileInputRef.current.value = null;
            alert(error.message);
            throw error;
        }
    }
    function handleCancelImageClick() {
        FirebaseStorageService.deleteFile(imageUrl);
        fileInputRef.current.value = null;
        setImageUrl("");
        setUploadProgress(-1);
        handleUploadCancel()
    }
    useEffect(() => {

        if (existingImageUrl) {
            setImageUrl(existingImageUrl);
        }
        else {

            setUploadProgress(-1)
            setImageUrl(null);
            fileInputRef.current.value = null;
        }
    }, [existingImageUrl])
    return (
        <>
            <div className='image-upload-preview-container'>
                <input type="file" accept="image/*" onChange={handleFileChanged} ref={fileInputRef} hidden={uploadProgress > -1 || imageUrl} />
                {
                    !imageUrl && uploadProgress > -1 ? (
                        <div>
                            <label htmlFor='file'>Upload Progress:</label>
                            <progress id="file" value={uploadProgress} max="100">
                                {uploadProgress}%
                            </progress>
                            <span>{uploadProgress}%</span>
                        </div>
                    ) : ""
                }
                {
                    imageUrl ? (
                        <div className='image-preview'>
                            <img src={imageUrl} alt={imageUrl} className="image" />
                            <button className='primary-button' onClick={handleCancelImageClick}>Cancel Image</button>
                        </div>
                    ) : ""
                }
            </div>
        </>
    )
}

export default ImageUploadPreview