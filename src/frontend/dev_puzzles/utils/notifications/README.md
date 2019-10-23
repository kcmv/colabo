# Intro

`@colabo-utils/f-notifications` is a **_f-colabo.space_** puzzle.

Puzzle that accepts different type of notifications and shows them.

It is injected in the root `appModule.ts` to be accessible at any level.

---

# BottomShDg

**example**:

```
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';
import { BottomShDgData, BottomShDg } from '@colabo-utils/f-notifications';

constructor(private bottomSheet: MatBottomSheet) {}

  let BottomShDgData:BottomShDgData = {title:'Map Deleting', message:'You want to delete the map "' + map.name + '"?', btn1:'Yes', btn2:'No', callback:deleteConfirmation.bind(this)};
  let bottomSheetRef:MatBottomSheetRef = this.bottomSheet.open(BottomShDg, { data: BottomShDgData, disableClose: true });
```

# Dialog

```
import { MatDialog, MatDialogRef } from "@angular/material";
import { Dialog, Dialog1Btn, Dialog2Btn, DialogData } from "@colabo-utils/f-notifications";

constructor(public dialog: MatDialog){}

this.dialogRef = Dialog.open(
      this.dialog,
      1,
      new DialogData("Submitting", "please wait ...", "Cancel", null, true),
      { disableClose: true },
      function() {
        console.log("The dialog NEW was closed");
      }
    );
```



# SnackBarNotification

available, yet to be described