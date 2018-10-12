import { Pipe } from "@angular/core";

@Pipe({
    name: "orderArrayPipe"
})
export class OrderArrayPipe {

    transform(array: Array<any>, args: string): Array<any> {
        if (typeof args[0] === "undefined") {
            return array;
        }

        let direction   = args[0][0];
        let column      = args[0].slice(1);
        if(direction !== '-' && direction !== '+') {
            direction = '+';
            column = args[0];
        }

        array.sort((a: any, b: any) => {

            let left    = a[column];
            let right   = b[column];

            return (direction === "-") ? right - left : left - right;
        });

        return array;
    }
}
