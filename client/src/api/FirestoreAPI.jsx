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

export const videosRef = collection(firestore, "videos");
export const usersRef = collection(firestore, "users");
export const likeRef = collection(firestore, "likes");
let commentsRef = collection(firestore, "comments");
let connectionRef = collection(firestore, "connections");

export const uploadVideo = (object, uploader) => {
  const docRef = doc(videosRef);
  setDoc(docRef, object);
  updateDoc(docRef, {
    views: 0,
    likes: 0,
    dislikes: 0,
    createdAt: serverTimestamp(),
    uploader: uploader,
  });
  toast.success("Video has been added successfully");
};

export const getVideos = (setAllStatus) => {
  let q = query(videosRef, orderBy("desc"));
  console.log(q);
  onSnapshot(q, (response) => {
    setAllStatus(
      response.docs.map((docs) => {
        console.log(docs.data());
        return { ...docs.data(), id: docs.id };
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

export const getSingleUser = async (setCurrentUser, uid) => {
  const docRef = doc(usersRef, uid);
  const docSnap = await getDoc(docRef);
  setCurrentUser(docSnap.data());
  return;
};

export const getSingleChannel = (setCurrentUser, uid) => {
  /*const singleChannelQuery = query(usersRef, where("uid", "==", uid));
  onSnapshot(singleChannelQuery, (response) => {
    setCurrentUser(
      response.docs.map((docs) => {
        return { ...docs.data(), id: docs.id };
      })
    );
  });*/
};

export const loginUserData = async (object, uid) => {
  const docRef = doc(usersRef, uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    toast.success("User has been logged in successfully");
  } else {
    setDoc(docRef, object);
    toast.success("User has been registered successfully");
  }
  return;
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
  const docRef = doc(videosRef, object.vid);
  updateDoc(docRef, {
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
};

export const likeVideo = async (vid, uid) => {
  // Get documents
  const videoDocRef = doc(videosRef, vid);
  const userDocRef = doc(usersRef, uid);
  const userDocSnap = await getDoc(doc(usersRef, uid));

  // Add liked video, else remove liked video from list
  if (userDocSnap.data().likedVideos?.includes(vid)) {
    updateDoc(videoDocRef, { likes: increment(-1) });
    updateDoc(userDocRef, { likedVideos: arrayRemove(vid) });
    console.log("Liked video removed");
  } else {
    updateDoc(videoDocRef, { likes: increment(1) });
    // Remove disliked video if it exists
    if (userDocSnap.data().dislikedVideos?.includes(vid)) {
      updateDoc(videoDocRef, { dislikes: increment(-1) });
      updateDoc(userDocRef, {
        dislikedVideos: arrayRemove(vid),
      });
    }
    updateDoc(userDocRef, { likedVideos: arrayUnion(vid) });
    console.log("Liked video added");
  }
  return;
};

export const dislikeVideo = async (vid, uid) => {
  // Get documents
  const videoDocRef = doc(videosRef, vid);
  const userDocRef = doc(usersRef, uid);
  const userDocSnap = await getDoc(doc(usersRef, uid));

  // Add disliked video, else remove disliked video from list
  if (userDocSnap.data().dislikedVideos?.includes(vid)) {
    updateDoc(videoDocRef, { dislikes: increment(-1) });
    updateDoc(userDocRef, { dislikedVideos: arrayRemove(vid) });
    console.log("Disliked video removed");
  } else {
    updateDoc(videoDocRef, { dislikes: increment(1) });
    // Remove liked video if it exists
    if (userDocSnap.data().likedVideos?.includes(vid)) {
      updateDoc(videoDocRef, { likes: increment(-1) });
      updateDoc(userDocRef, { likedVideos: arrayRemove(vid) });
    }
    updateDoc(userDocRef, { dislikedVideos: arrayUnion(vid) });
    console.log("Disliked video added");
  }
  return;
};

export const subscribeChannel = async (upUid, viUid) => {
  // Get documents
  const upDocRef = doc(usersRef, upUid);
  const viDocRef = doc(usersRef, viUid);
  const viDocSnap = await getDoc(viDocRef);

  // Add subscribed channel
  if (viDocSnap.data().subscribedChannels?.includes(upUid)) {
    updateDoc(upDocRef, { subscribers: increment(-1) });
    updateDoc(viDocRef, { subscribedChannels: arrayRemove(upUid) });
    console.log("Unsubscribed");
  } else {
    updateDoc(upDocRef, { subscribers: increment(1) });
    updateDoc(viDocRef, { subscribedChannels: arrayUnion(upUid) });
    console.log("Subscribed");
  }
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
