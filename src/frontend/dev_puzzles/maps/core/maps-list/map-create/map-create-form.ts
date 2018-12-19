import {Component} from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material';

@Component({
    selector: 'map-create-form',
    templateUrl: 'map-create-form.html',
})
export class MapCreateForm {
    constructor(private bottomSheetRef: MatBottomSheetRef<MapCreateForm>) {}

    openLink(event: MouseEvent): void {
        this.bottomSheetRef.dismiss();
        event.preventDefault();
    }
}