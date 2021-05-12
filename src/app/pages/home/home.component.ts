import { Component } from '@angular/core';
import { blue, white } from '@pxblue/colors';
import { ViewportService } from '../../services/viewport/viewport.service';
import {ApiService} from "../../services/api/api.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    pxbBlue = blue;
    data: any;
    pxbWhite = white;

    constructor(private readonly _viewportService: ViewportService, private readonly _apiService: ApiService) {}

    ngOnInit(): void {
        this._apiService.testApi().then((data) => {
            console.log('success');
            console.log(data);
            this.data = data;
        }).catch((err) => {
            console.log(err);
        })
    }

    isSmall(): boolean {
        return this._viewportService.isSmall();
    }
}
