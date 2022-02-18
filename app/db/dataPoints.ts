import type {
  CollectionReference,
  DocumentReference,
  Query,
} from "firebase-admin/firestore";
import {getFirestore} from "~/firebase/firebaseAdmin.server";

const DATA_POINTS_COLLECTION = "dataPoints";

export interface DataPoint {
  userId: string;
  point: number;
  timestamp: number;
}

const getCollectionRef = () => getFirestore().collection(
  DATA_POINTS_COLLECTION
) as CollectionReference<DataPoint>;

const getDocReference = (dataPointId) =>
  getCollectionRef().doc(dataPointId) as DocumentReference<DataPoint>;

const getQuery = (userId) =>
  getCollectionRef().where("userId", "==", userId) as Query<DataPoint>;

export async function getAllDataPoints(userId): Promise<DataPoint[]> {
  const queryRef = getQuery(userId);
  const querySnapshot = await queryRef.get();
  return querySnapshot.docs.map((doc) => doc.data());
}

export async function getDataPoint(dataPointId): Promise<DataPoint | null> {
  const docRef = getDocReference(dataPointId);
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    return docSnap?.data() || null;
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    return null;
  }
}

export async function addDataPoint(dataPoint: DataPoint): Promise<DataPoint> {
  try {
    const docRef = await getCollectionRef().add(dataPoint);

    const newDataPoint = await getDataPoint(docRef.id);
    if (!newDataPoint) {
      throw new Error("Failed to get new data point");
    }
    return newDataPoint;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}
