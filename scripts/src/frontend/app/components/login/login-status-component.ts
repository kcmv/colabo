import {Component} from '@angular/core';

@Component({
    selector: 'login-status', template: `
        <div class="container">
            <span class='msg'>ng2-component:</span>
            <h2>User - mPrinc</h2>
            <div><label>IAm: </label>5</div>
        </div>
    `,
    styles: [`
        .msg {
            font-size: 0.5em;
        }
        .container{
            margin: 5px;
            border: 1px solid gray;
        }
    `]
})
export class LoginStatusComponent {
}
