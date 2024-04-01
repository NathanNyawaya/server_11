import express from "express";
import {
  getAdmins,
  getAllUsers,
  getControlUsers,
  getMainAdmins,
  getMasters,
  getNormal,
  getSupers,
  getUserData,
  getPanelUsers,
  editUser,
  getControl,
  getMainAdminsControl,
  getAdminsControl,
  getMasterControl,
  getSupersControl,
  getPanelControl,
  getNormalControl,
  editUserControl,
  editUserStatus,
  getEventsFromParent,
  getChildEvents,
  editUserCreditRef,
  editUserExposureLimit,
  getCurrentUserEvents,
} from "../controllers/users/users.js";
import { updateEventListAndPropagate } from "../managers/sport_access_01/main.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/userdata", getUserData);

router.get("/controlusers", getControlUsers);
router.get("/mainadmins", getMainAdmins);
router.get("/admins", getAdmins);
router.get("/masters", getMasters);
router.get("/supers", getSupers);
router.get("/panels", getPanelUsers);
router.get("/normals", getNormal);

router.post("/getevents", getEventsFromParent);
router.post("/getmainevents", getChildEvents);
router.post("/getchildevents", getChildEvents);
router.get("/curevents", getCurrentUserEvents);

router.post("/patch", editUser);
router.post("/status_patch", editUserStatus);
router.post("/credit_ref_patch", editUserCreditRef);
router.post("/exposure_limit_patch", editUserExposureLimit);
router.post("/event_list_patch", updateEventListAndPropagate);


// systemctl
router.get("/control/controlusers", getControl)
router.get("/control/mainadmins", getMainAdminsControl);
router.get("/control/admins", getAdminsControl);
router.get("/control/masters", getMasterControl);
router.get("/control/supers", getSupersControl);
router.get("/control/panels", getPanelControl);
router.get("/control/normals", getNormalControl);
router.post("/control/patch", editUserControl);

export default router;
