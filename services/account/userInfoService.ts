import { FirebaseError } from "firebase/app";
import { auth } from "../../config";
import { ErrorCodes } from "../../const/errorCodes";
import { CurrentUser, IUserData } from "../../utils/user";
import { updatePathValues } from "../firestore/userFuncs";
import { PHONE_EMAIL_PATH, USER_PATH } from './../../const/firestorePaths';

/**
 * Updates user info stored in Firestore.
 * This consumes 1 write if phone didn't change, 2 if phone changed.
 * 
 * @remarks
 * Throws a {@link FirebaseError}) with error code {@link ErrorCodes.NOT_LOGGED_IN} 
 * if no user is logged in.
 * 
 * @param {JSON Object} data :Data to be updated in Firestore, use {@link userData} as a format
 */
export async function updateUserInfo(data : IUserData, target : string | null | undefined){
    if(!auth.currentUser) throw new FirebaseError(ErrorCodes.NOT_LOGGED_IN[0], ErrorCodes.NOT_LOGGED_IN[1]);
    if(!target){
        target = auth.currentUser.uid;
    }
    
    await updatePathValues(USER_PATH + target, data);
    if(CurrentUser.user.phone !== data.phone)
        await updatePathValues(PHONE_EMAIL_PATH + target, {phone: data.phone});
    
    if(target == auth.currentUser.uid) CurrentUser.updateInfo(data);
}