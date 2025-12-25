---
agent: firebase
---

# Create a Cloud Storage reference on Web  |  Cloud Storage for Firebase

Your files are stored in a Cloud Storage bucket. The files in this bucket are presented in a hierarchical structure, just like the file system on your local hard disk, or the data in the Firebase Realtime Database. By creating a reference to a file, your app gains access to it. These references can then be used to upload or download data, get or update metadata or delete the file. A reference can either point to a specific file or to a higher level node in the hierarchy.

If you've used the Firebase Realtime Database, these paths should seem very familiar to you. However, your file data is stored in Cloud Storage, **not** in the Realtime Database.

## Create a Reference

In order to upload or download files, delete files, or get or update metadata, you must create a reference to the file you want to operate on. A reference can be thought of as a pointer to a file in the cloud. References are lightweight, so you can create as many as you need, and they are also reusable for multiple operations.

To create a reference, get an instance of the Storage service using `getStorage()` then call `ref()` with the service as an argument. This reference points to the root of your Cloud Storage bucket.

```ts
import { getStorage, ref } from "firebase/storage";

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();

// Create a storage reference from our storage service
const storageRef = ref(storage);
```

[storage_create_ref.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/snippets/storage-next/create-reference/storage_create_ref.js#L8-L14)

```ts
// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();

// Create a storage reference from our storage service
var storageRef = storage.ref();
```

[create-reference.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/storage/create-reference.js#L6-L10)

You can create a reference to a location lower in the tree, say `'images/space.jpg'` by passing in this path as a second argument when calling `ref()`.

```ts
import { getStorage, ref } from "firebase/storage";

const storage = getStorage();

// Create a child reference
const imagesRef = ref(storage, "images");
// imagesRef now points to 'images'

// Child references can also take paths delimited by '/'
const spaceRef = ref(storage, "images/space.jpg");
// spaceRef now points to "images/space.jpg"
// imagesRef still points to "images"
```

[storage_create_ref_child.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/snippets/storage-next/create-reference/storage_create_ref_child.js#L8-L19)

```ts
// Create a child reference
var imagesRef = storageRef.child("images");
// imagesRef now points to 'images'

// Child references can also take paths delimited by '/'
var spaceRef = storageRef.child("images/space.jpg");
// spaceRef now points to "images/space.jpg"
// imagesRef still points to "images"
```

[create-reference.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/storage/create-reference.js#L18-L25)

## Navigate with References

You can also use the `parent` and `root` properties to navigate up the file hierarchy. `parent` navigates up one level, while `root` navigates all the way to the top.

```ts
import { getStorage, ref } from "firebase/storage";

const storage = getStorage();
const spaceRef = ref(storage, "images/space.jpg");

// Parent allows us to move to the parent of a reference
const imagesRef = spaceRef.parent;
// imagesRef now points to 'images'

// Root allows us to move all the way back to the top of our bucket
const rootRef = spaceRef.root;
// rootRef now points to the root
```

[storage_navigate_ref.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/snippets/storage-next/create-reference/storage_navigate_ref.js#L8-L19)

```ts
// Parent allows us to move to the parent of a reference
var imagesRef = spaceRef.parent;
// imagesRef now points to 'images'

// Root allows us to move all the way back to the top of our bucket
var rootRef = spaceRef.root;
// rootRef now points to the root
```

[create-reference.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/storage/create-reference.js#L33-L39)

`child()`, `parent`, and `root` can be chained together multiple times, as each returns a reference. The exception is the `parent` of `root`, which is `null`.

```ts
import { getStorage, ref } from "firebase/storage";

const storage = getStorage();
const spaceRef = ref(storage, "images/space.jpg");

// References can be chained together multiple times
const earthRef = ref(spaceRef.parent, "earth.jpg");
// earthRef points to 'images/earth.jpg'

// nullRef is null, since the parent of root is null
const nullRef = spaceRef.root.parent;
```

[storage_navigate_ref_chain.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/snippets/storage-next/create-reference/storage_navigate_ref_chain.js#L8-L18)

```ts
// References can be chained together multiple times
var earthRef = spaceRef.parent.child("earth.jpg");
// earthRef points to 'images/earth.jpg'

// nullRef is null, since the parent of root is null
var nullRef = spaceRef.root.parent;
```

[create-reference.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/storage/create-reference.js#L47-L52)

## Reference Properties

You can inspect references to better understand the files they point to using the `fullPath`, `name`, and `bucket` properties. These properties get the full path of the file, the name of the file, and the bucket the file is stored in.

```ts
import { getStorage, ref } from "firebase/storage";

const storage = getStorage();
const spaceRef = ref(storage, 'images/space.jpg');

// Reference's path is: 'images/space.jpg'
// This is analogous to a file path on disk
spaceRef.fullPath;

// Reference's name is the last segment of the full path: 'space.jpg'
// This is analogous to the file name
spaceRef.name;

// Reference's bucket is the name of the storage bucket where files are stored
spaceRef.bucket;

[storage_ref_properties.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/snippets/storage-next/create-reference/storage_ref_properties.js#L8-L22)

// Reference's path is: 'images/space.jpg'
// This is analogous to a file path on disk
spaceRef.fullPath;

// Reference's name is the last segment of the full path: 'space.jpg'
// This is analogous to the file name
spaceRef.name;

// Reference's bucket is the name of the storage bucket where files are stored
spaceRef.bucket;
```

[create-reference.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/storage/create-reference.js#L60-L69)

## Limitations on References

Reference paths and names can contain any sequence of valid Unicode characters, but certain restrictions are imposed including:

1.  Total length of `reference.fullPath` must be between 1 and 1024 bytes when UTF-8 encoded.
2.  No Carriage Return or Line Feed characters.
3.  Avoid using `#`, `[`, `]`, `*`, or `?`, as these do not work well with other tools such as the Firebase Realtime Database or [gsutil](https://cloud.google.com/storage/docs/gsutil).

## Full Example

```ts
import { getStorage, ref } from "firebase/storage";

const storage = getStorage();

// Points to the root reference
const storageRef = ref(storage);

// Points to 'images'
const imagesRef = ref(storageRef, "images");

// Points to 'images/space.jpg'
// Note that you can use variables to create child values
const fileName = "space.jpg";
const spaceRef = ref(imagesRef, fileName);

// File path is 'images/space.jpg'
const path = spaceRef.fullPath;

// File name is 'space.jpg'
const name = spaceRef.name;

// Points to 'images'
const imagesRefAgain = spaceRef.parent;
```

[storage_ref_full_example.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/snippets/storage-next/create-reference/storage_ref_full_example.js#L8-L30)

```ts
// Points to the root reference
var storageRef = firebase.storage().ref();

// Points to 'images'
var imagesRef = storageRef.child("images");

// Points to 'images/space.jpg'
// Note that you can use variables to create child values
var fileName = "space.jpg";
var spaceRef = imagesRef.child(fileName);

// File path is 'images/space.jpg'
var path = spaceRef.fullPath;

// File name is 'space.jpg'
var name = spaceRef.name;

// Points to 'images'
var imagesRef = spaceRef.parent;
```

# Upload files with Cloud Storage on Web  |  Cloud Storage for Firebase

# Upload files with Cloud Storage on Web bookmark_borderbookmark Stay organized with collections Save and categorize content based on your preferences.

- On this page
- Upload Files
  - Upload from a Blob or File
  - Upload from a Byte Array
  - Upload from a String
- Add File Metadata
- Manage Uploads
- Monitor Upload Progress
- Error Handling
- Full Example

Cloud Storage for Firebase allows you to quickly and easily upload files to a Cloud Storage bucket provided and managed by Firebase.

## Upload Files

To upload a file to Cloud Storage, you first create a reference to the full path of the file, including the file name.

```ts
import { getStorage, ref } from "firebase/storage";

// Create a root reference
const storage = getStorage();

// Create a reference to 'mountains.jpg'
const mountainsRef = ref(storage, "mountains.jpg");

// Create a reference to 'images/mountains.jpg'
const mountainImagesRef = ref(storage, "images/mountains.jpg");

// While the file names are the same, the references point to different files
mountainsRef.name === mountainImagesRef.name; // true
mountainsRef.fullPath === mountainImagesRef.fullPath; // false
```

[storage_upload_ref.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/snippets/storage-next/upload-files/storage_upload_ref.js#L8-L21)

```ts
// Create a root reference
var storageRef = firebase.storage().ref();

// Create a reference to 'mountains.jpg'
var mountainsRef = storageRef.child("mountains.jpg");

// Create a reference to 'images/mountains.jpg'
var mountainImagesRef = storageRef.child("images/mountains.jpg");

// While the file names are the same, the references point to different files
mountainsRef.name === mountainImagesRef.name; // true
mountainsRef.fullPath === mountainImagesRef.fullPath; // false
```

[upload-files.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/storage/upload-files.js#L6-L17)

### Upload from a `Blob` or `File`

Once you've created an appropriate reference, you then call the `uploadBytes()` method. `uploadBytes()` takes files via the JavaScript [File](https://developer.mozilla.org/en-US/docs/Web/API/File) and [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) APIs and uploads them to Cloud Storage.

```ts
import { getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage();
const storageRef = ref(storage, "some-child");

// 'file' comes from the Blob or File API
uploadBytes(storageRef, file).then((snapshot) => {
  console.log("Uploaded a blob or file!");
});
```

[storage_upload_blob.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/snippets/storage-next/upload-files/storage_upload_blob.js#L8-L16)

```ts
// 'file' comes from the Blob or File API
ref.put(file).then((snapshot) => {
  console.log("Uploaded a blob or file!");
});
```

[upload-files.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/storage/upload-files.js#L28-L31)

### Upload from a Byte Array

In addition to the `File` and `Blob` types, `uploadBytes()` can also upload a `Uint8Array` to Cloud Storage.

```ts
import { getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage();
const storageRef = ref(storage, "some-child");

const bytes = new Uint8Array([
  0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21,
]);
uploadBytes(storageRef, bytes).then((snapshot) => {
  console.log("Uploaded an array!");
});
```

[storage_upload_bytes.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/snippets/storage-next/upload-files/storage_upload_bytes.js#L8-L16)

```ts
var bytes = new Uint8Array([
  0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21,
]);
ref.put(bytes).then((snapshot) => {
  console.log("Uploaded an array!");
});
```

[upload-files.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/storage/upload-files.js#L39-L42)

### Upload from a String

If a `Blob`, `File`, or `Uint8Array` isn't available, you can use the `uploadString()` method to upload a raw, `base64`, `base64url`, or `data_url` encoded string to Cloud Storage.

```ts
import { getStorage, ref, uploadString } from "firebase/storage";

const storage = getStorage();
const storageRef = ref(storage, "some-child");

// Raw string is the default if no format is provided
const message = "This is my message.";
uploadString(storageRef, message).then((snapshot) => {
  console.log("Uploaded a raw string!");
});

// Base64 formatted string
const message2 = "5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB";
uploadString(storageRef, message2, "base64").then((snapshot) => {
  console.log("Uploaded a base64 string!");
});

// Base64url formatted string
const message3 = "5b6p5Y-344GX44G-44GX44Gf77yB44GK44KB44Gn44Go44GG77yB";
uploadString(storageRef, message3, "base64url").then((snapshot) => {
  console.log("Uploaded a base64url string!");
});

// Data URL string
const message4 =
  "data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB";
uploadString(storageRef, message4, "data_url").then((snapshot) => {
  console.log("Uploaded a data_url string!");
});
```

[storage_upload_string.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/snippets/storage-next/upload-files/storage_upload_string.js#L8-L35)

```ts
// Raw string is the default if no format is provided
var message = "This is my message.";
ref.putString(message).then((snapshot) => {
  console.log("Uploaded a raw string!");
});

// Base64 formatted string
var message = "5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB";
ref.putString(message, "base64").then((snapshot) => {
  console.log("Uploaded a base64 string!");
});

// Base64url formatted string
var message = "5b6p5Y-344GX44G-44GX44Gf77yB44GK44KB44Gn44Go44GG77yB";
ref.putString(message, "base64url").then((snapshot) => {
  console.log("Uploaded a base64url string!");
});

// Data URL string
var message =
  "data:text/plain;base64,5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB";
ref.putString(message, "data_url").then((snapshot) => {
  console.log("Uploaded a data_url string!");
});
```

[upload-files.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/storage/upload-files.js#L50-L72)

Since the reference defines the full path to the file, make sure that you are uploading to a non-empty path.

## Add File Metadata

When uploading a file, you can also specify metadata for that file. This metadata contains typical file metadata properties such as `name`, `size`, and `contentType` (commonly referred to as MIME type). Cloud Storage automatically infers the content type from the file extension where the file is stored on disk, but if you specify a `contentType` in the metadata it will override the auto-detected type. If no `contentType` metadata is specified and the file doesn't have a file extension, Cloud Storage defaults to the type `application/octet-stream`. More information on file metadata can be found in the Use File Metadata section.

```ts
import { getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage();
const storageRef = ref(storage, "images/mountains.jpg");

// Create file metadata including the content type
/** @type {any} */
const metadata = {
  contentType: "image/jpeg",
};

// Upload the file and metadata
const uploadTask = uploadBytes(storageRef, file, metadata);
```

[storage_upload_metadata.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/snippets/storage-next/upload-files/storage_upload_metadata.js#L8-L20)

```ts
// Create file metadata including the content type
var metadata = {
  contentType: "image/jpeg",
};

// Upload the file and metadata
var uploadTask = storageRef.child("images/mountains.jpg").put(file, metadata);
```

[upload-files.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/storage/upload-files.js#L83-L89)

## Manage Uploads

In addition to starting uploads, you can pause, resume, and cancel uploads using the `pause()`, `resume()`, and `cancel()` methods. Calling `pause()` or `resume()` will raise `pause` or `running` state changes. Calling the `cancel()` method results in the upload failing and returning an error indicating that the upload was canceled.

```ts
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";

const storage = getStorage();
const storageRef = ref(storage, 'images/mountains.jpg');

// Upload the file and metadata
const uploadTask = uploadBytesResumable(storageRef, file);

// Pause the upload
uploadTask.pause();

// Resume the upload
uploadTask.resume();

// Cancel the upload
uploadTask.cancel();

[storage_manage_uploads.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/snippets/storage-next/upload-files/storage_manage_uploads.js#L8-L23)

// Upload the file and metadata
var uploadTask = storageRef.child('images/mountains.jpg').put(file);

// Pause the upload
uploadTask.pause();

// Resume the upload
uploadTask.resume();

// Cancel the upload
uploadTask.cancel();
```

[upload-files.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/storage/upload-files.js#L100-L110)

## Monitor Upload Progress

The reference this task came from.

These changes in state, combined with the properties of the `TaskSnapshot` provide a simple yet powerful way to monitor upload events.

```ts
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const storage = getStorage();
const storageRef = ref(storage, "images/rivers.jpg");

const uploadTask = uploadBytesResumable(storageRef, file);

// Register three observers:
// 1. 'state_changed' observer, called any time the state changes
// 2. Error observer, called on failure
// 3. Completion observer, called on successful completion
uploadTask.on(
  "state_changed",
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log("Upload is " + progress + "% done");
    switch (snapshot.state) {
      case "paused":
        console.log("Upload is paused");
        break;
      case "running":
        console.log("Upload is running");
        break;
    }
  },
  (error) => {
    // Handle unsuccessful uploads
  },
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log("File available at", downloadURL);
    });
  }
);
```

[storage_monitor_upload.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/snippets/storage-next/upload-files/storage_monitor_upload.js#L8-L44)

```ts
var uploadTask = storageRef.child("images/rivers.jpg").put(file);

// Register three observers:
// 1. 'state_changed' observer, called any time the state changes
// 2. Error observer, called on failure
// 3. Completion observer, called on successful completion
uploadTask.on(
  "state_changed",
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log("Upload is " + progress + "% done");
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log("Upload is paused");
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log("Upload is running");
        break;
    }
  },
  (error) => {
    // Handle unsuccessful uploads
  },
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
      console.log("File available at", downloadURL);
    });
  }
);
```

[upload-files.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/storage/upload-files.js#L121-L152)

## Error Handling

There are a number of reasons why errors may occur on upload, including the local file not existing, or the user not having permission to upload the desired file. More information on errors can be found in the Handle Errors section of the docs.

## Full Example

A full example of an upload with progress monitoring and error handling is shown below:

```ts
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const storage = getStorage();

// Create the file metadata
/** @type {any} */
const metadata = {
  contentType: "image/jpeg",
};

// Upload file and metadata to the object 'images/mountains.jpg'
const storageRef = ref(storage, "images/" + file.name);
const uploadTask = uploadBytesResumable(storageRef, file, metadata);

// Listen for state changes, errors, and completion of the upload.
uploadTask.on(
  "state_changed",
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log("Upload is " + progress + "% done");
    switch (snapshot.state) {
      case "paused":
        console.log("Upload is paused");
        break;
      case "running":
        console.log("Upload is running");
        break;
    }
  },
  (error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case "storage/unauthorized":
        // User doesn't have permission to access the object
        break;
      case "storage/canceled":
        // User canceled the upload
        break;

      // ...

      case "storage/unknown":
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  },
  () => {
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log("File available at", downloadURL);
    });
  }
);
```

[storage_upload_handle_error.js](https://github.com/firebase/snippets-web/blob/95c8c159ff4d90af442352f058406f1aeb8adcbb/snippets/storage-next/upload-files/storage_upload_handle_error.js#L8-L61)

```ts
// Create the file metadata
var metadata = {
  contentType: "image/jpeg",
};

// Upload file and metadata to the object 'images/mountains.jpg'
var uploadTask = storageRef.child("images/" + file.name).put(file, metadata);

// Listen for state changes, errors, and completion of the upload.
uploadTask.on(
  firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log("Upload is " + progress + "% done");
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log("Upload is paused");
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log("Upload is running");
        break;
    }
  },
  (error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case "storage/unauthorized":
        // User doesn't have permission to access the object
        break;
      case "storage/canceled":
        // User canceled the upload
        break;

      // ...

      case "storage/unknown":
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  },
  () => {
    // Upload completed successfully, now we can get the download URL
    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
      console.log("File available at", downloadURL);
    });
  }
);
```
