import { firestore } from "../firebase";
import {
  addDoc,
  arrayUnion,
  arrayRemove,
  increment,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
  setDoc,
  getDocs,
  deleteDoc,
  orderBy,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

let videosRef = collection(firestore, "videos");
let usersRef = collection(firestore, "users");
let likeRef = collection(firestore, "likes");
let commentsRef = collection(firestore, "comments");
let connectionRef = collection(firestore, "connections");

export const uploadVideo = (object, uploader) => {
  //const tempDoc = addDoc(videosRef, object);
  const tempDoc = doc(videosRef);
  console.log(tempDoc);
  /*setDoc(tempDoc, object);
  updateDoc(tempDoc, {
    views: 0,
    likes: 0,
    dislikes: 0,
    createdAt: serverTimestamp(),
    uploader: uploader,
  })
    .then(() => {
      toast.success("Video has been added successfully");
    })
    .catch((err) => {
      console.log(err);
    });*/
};

export const getVideos = (setAllStatus) => {
  let q = query(videosRef, orderBy("desc"));
  console.log(q);
  onSnapshot(q, (response) => {
    setAllStatus(
      response.docs.map((docs) => {
        console.log(docs.data());
        return { ...docs.data(), id: docs.id };
        //return docs.data();
      })
    );
  });
};

/*export const getAllUsers = (setAllUsers) => {
  onSnapshot(userRef, (response) => {
    setAllUsers(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};*/

export const getSingleVideo = (setAllStatus, id) => {
  //const singleVideoQuery = query(videosRef, where("id", "==", id));
  const q = query(videosRef);
  onSnapshot(q, (response) => {
    setAllStatus(
      response.docs.map((docs) => {
        console.log();
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};

export const getSingleUser = (setCurrentUser, email) => {
  const singleUserQuery = query(usersRef, where("email", "==", email));
  onSnapshot(singleUserQuery, (response) => {
    setCurrentUser(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};

export const getSingleChannel = (setCurrentUser, uid) => {
  const singleChannelQuery = query(usersRef, where("uid", "==", uid));
  onSnapshot(singleChannelQuery, (response) => {
    setCurrentUser(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })
    );
  });
};

export const loginUserData = (object) => {
  /*const singleUserQuery = query(usersRef, where("email", "==", object.email));
  console.log(singleUserQuery)
  if (singleUserQuery == object.email) {
    console.log("Yatta!");
    toast.success("User has been logged in successfully");
  } else {
    console.log("Nani?")
    const newRef = doc(usersRef);
    setDoc(newRef, object)*/
  setDoc(doc(usersRef, object.email), object)
    .then(() => {
      console.log("How are you?");
      toast.success("User has been registered successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

/*export const getCurrentUser = (setCurrentUser) => {
  onSnapshot(userRef, (response) => {
    setCurrentUser(
      response.docs
        .map((docs) => {
          return { ...docs.data(), id: docs.id };
        })
        .filter((item) => {
          return item.email === localStorage.getItem("userEmail");
        })[0]
    );
  });
};

export const editProfile = (userID, payload) => {
  let userToEdit = doc(userRef, userID);

  updateDoc(userToEdit, payload)
    .then(() => {
      toast.success("Profile has been updated successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const likePost = (userId, postId, liked) => {
  try {
    let docToLike = doc(likeRef, `${userId}_${postId}`);
    if (liked) {
      deleteDoc(docToLike);
    } else {
      setDoc(docToLike, { userId, postId });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getLikesByUser = (userId, postId, setLiked, setLikesCount) => {
  try {
    let likeQuery = query(likeRef, where("postId", "==", postId));

    onSnapshot(likeQuery, (response) => {
      let likes = response.docs.map((doc) => doc.data());
      let likesCount = likes?.length;

      const isLiked = likes.some((like) => like.userId === userId);

      setLikesCount(likesCount);
      setLiked(isLiked);
    });
  } catch (err) {
    console.log(err);
  }
};*/

export const uploadVideoComment = (object) => {
  updateDoc(doc(videosRef, object.vid), {
    comments: arrayUnion({
      comment: object.comment,
      likes: 0,
      dislikes: 0,
      photoUrl: object.photoUrl,
      postedAt: object.postedAt,
      username: object.username,
      uid: object.uid,
      vid: object.vid,
    }),
  });
};

export const getVideoComments = async (setComments, vid) => {
  const docRef = doc(videosRef, vid);
  const docSnap = await getDoc(docRef);
  setComments(docSnap.data().comments);
  console.log(docSnap.data().comments);
};

export const likeVideo = async (vid, uid) => {
  // Get userDoc
  const userQuery = query(usersRef, where("uid", "==", uid));
  const userSnapDocs = await getDocs(userQuery);
  let userDoc;
  userSnapDocs.forEach((doc) => {
    userDoc = doc;
  });

  // Add liked video, else remove liked video from list
  if (userDoc.data().likedVideos?.includes(vid)) {
    updateDoc(doc(videosRef, vid), { likes: increment(-1) });
    updateDoc(doc(usersRef, userDoc.id), { likedVideos: arrayRemove(vid) });
    console.log("Liked video removed");
  } else {
    updateDoc(doc(videosRef, vid), { likes: increment(1) });
    // Remove disliked video if it exists
    if (userDoc.data().dislikedVideos?.includes(vid)) {
      updateDoc(doc(videosRef, vid), { dislikes: increment(-1) });
      updateDoc(doc(usersRef, userDoc.id), { dislikedVideos: arrayRemove(vid) });
    }
    updateDoc(doc(usersRef, userDoc.id), { likedVideos: arrayUnion(vid) });
    console.log("Liked video added");
  }
  return;
};

export const dislikeVideo = async (vid, uid) => {
  // Get userDoc
  const userQuery = query(usersRef, where("uid", "==", uid));
  const userSnapDocs = await getDocs(userQuery);
  let userDoc;
  userSnapDocs.forEach((doc) => {
    userDoc = doc;
  });

  // Add disliked video, else remove disliked video from list
  if (userDoc.data().dislikedVideos?.includes(vid)) {
    updateDoc(doc(videosRef, vid), { dislikes: increment(-1) });
    updateDoc(doc(usersRef, userDoc.id), { dislikedVideos: arrayRemove(vid) });
    console.log("Disliked video removed");
  } else {
    updateDoc(doc(videosRef, vid), { dislikes: increment(1) });
    // Remove liked video if it exists
    if (userDoc.data().likedVideos?.includes(vid)) {
      updateDoc(doc(videosRef, vid), { likes: increment(-1) });
      updateDoc(doc(usersRef, userDoc.id), { likedVideos: arrayRemove(vid) });
    }
    updateDoc(doc(usersRef, userDoc.id), { dislikedVideos: arrayUnion(vid) });
    console.log("Disliked video added");
  }
  return;
};

/*export const updatePost = (id, status, postImage) => {
  let docToUpdate = doc(postsRef, id);
  try {
    if (postImage) {
      updateDoc(docToUpdate, { status, postImage });
    } else {
      updateDoc(docToUpdate, { status });
    }
    toast.success("Post has been updated!");
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = (id) => {
  let docToDelete = doc(postsRef, id);
  try {
    deleteDoc(docToDelete);
    toast.success("Post has been Deleted!");
  } catch (err) {
    console.log(err);
  }
};

export const addConnection = (userId, targetId) => {
  try {
    let connectionToAdd = doc(connectionRef, `${userId}_${targetId}`);

    setDoc(connectionToAdd, { userId, targetId });

    toast.success("Connection Added!");
  } catch (err) {
    console.log(err);
  }
};

export const getConnections = (userId, targetId, setIsConnected) => {
  try {
    let connectionsQuery = query(
      connectionRef,
      where("targetId", "==", targetId)
    );

    onSnapshot(connectionsQuery, (response) => {
      let connections = response.docs.map((doc) => doc.data());

      const isConnected = connections.some(
        (connection) => connection.userId === userId
      );

      setIsConnected(isConnected);
    });
  } catch (err) {
    console.log(err);
  }
};*/
