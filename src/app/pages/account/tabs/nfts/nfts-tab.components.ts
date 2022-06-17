import {Component, Input, ViewEncapsulation} from '@angular/core';
import {AccountNFTDto} from "@app/types/dto";

@Component({
    selector: 'account-nfts-tab',
    template: `
        <div class="mat-headline">Account NFTs</div>
        <div class="mat-subheading-2" *ngIf="isLoadingNFTs">Loading...</div>
        <div *ngIf="!isLoadingNFTs">

            <ng-container *ngIf="nfts.length !== 0">
                <mat-card *ngFor="let nft of nfts">
                    <div mat-header-row>{{nft.name}}</div>
                    <img [src]="ipfsUrl + nft.image" style="height: 200px; width: 200px">
                    <div class="mat-subheading-2">{{nft.description}}</div>
                </mat-card>
            </ng-container>

            <ng-container *ngIf="nfts.length === 0">
                <div class="mat-subheading-2">Account has no NFTs.</div>
            </ng-container>
        </div>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class NftsTabComponents {

    ipfsUrl = 'https://ipfs.io/ipfs/';

    @Input() address: string;
    @Input() isLoadingNFTs: boolean;
    @Input() nfts: AccountNFTDto[] = [];
}
