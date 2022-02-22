import type {
  CollectionReference,
  DocumentReference,
  Query,
} from "firebase-admin/firestore";
import {getFirestore} from "~/firebase/firebaseAdmin.server";

const TODOS_COLLECTION = "todos";

export interface Todo {
  id: string,
  text: string,
  isCompleted: boolean,
  collection: string,
  isDeleted: boolean,
  userId: string
  createdTimestamp: number
}

const getCollectionRef = () => getFirestore().collection(
  TODOS_COLLECTION
) as CollectionReference<Todo>;

const getDocReference = (dataPointId) =>
  getCollectionRef().doc(dataPointId) as DocumentReference<Todo>;

const getQuery = (userId) =>
  getCollectionRef().where("userId", "==", userId) as Query<Todo>;

function makeTodoFromDoc(docSnap){
  return {
    id: docSnap.id,
    ...docSnap.data()
  }
}

export async function getAllTodos(userId): Promise<Todo[]> {
  const queryRef = getQuery(userId);
  const querySnapshot = await queryRef.get();
  return querySnapshot.docs.map(makeTodoFromDoc);
}
export async function getAllNonDeletedTodos(userId): Promise<Todo[]> {
  const queryRef = getQuery(userId).where("isDeleted", "==", false);
  const querySnapshot = await queryRef.get();
  return querySnapshot.docs.map(makeTodoFromDoc);
}

export async function getTodo(todoId): Promise<Todo | null> {
  const docRef = getDocReference(todoId);
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    return makeTodoFromDoc(docSnap) || null;
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    return null;
  }
}

export async function addTodo(todo: Todo): Promise<Todo> {
  try {
    const docRef = await getCollectionRef().add(todo);

    const newTodo = await getTodo(docRef.id);
    if (!newTodo) {
      throw new Error("Failed to get new Todo");
    }
    return newTodo;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

export async function updateTodo(todoId): Promise<Todo> {
  try {

    const todo = await getTodo(todoId);
    if (!todo) {
      throw new Error("Failed to get existing Todo");
    }
    const nextTodo = {...todo, isCompleted: !todo.isCompleted}
    await getDocReference(todoId).set(nextTodo);
    const updatedTodo = await getTodo(todoId);
    if (!updatedTodo) {
      throw new Error("Failed to get updated Todo");
    }
    return updatedTodo;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

export async function deleteTodo(todoId): Promise<Todo> {
  try {

    const todo = await getTodo(todoId);
    if (!todo) {
      throw new Error("Failed to get existing Todo");
    }
    const nextTodo = {...todo, isDeleted: true}
    await getDocReference(todoId).set(nextTodo);
    const updatedTodo = await getTodo(todoId);
    if (!updatedTodo) {
      throw new Error("Failed to get updated Todo");
    }
    return updatedTodo;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}
