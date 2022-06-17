import {Component, Input, ViewEncapsulation} from '@angular/core';
import {AccountNFTDto} from "@app/types/dto";

@Component({
    selector: 'account-nfts-tab',
    template: `
        <div class="mat-headline" style="padding: 32px">Account NFTs</div>
        <div class="mat-subheading-2" *ngIf="isLoadingNFTs" style="padding: 32px">Loading...</div>
        <div *ngIf="!isLoadingNFTs" style="display: flex;flex-wrap: wrap; justify-content: center">

            <ng-container *ngIf="nfts.length !== 0">
                <mat-card *ngFor="let nft of nfts" style="max-width: 400px; margin: 32px" class="divider-border">
                    <div class="mat-display-1" style="margin-bottom: 0;">{{nft.name}}</div>
                    <div class="mat-subheading-1" style="margin-bottom: 24px">Owns x{{nft.quantity}}</div>
                    <img [src]="ipfsUrl + nft.image" style="width: 100%">
                    <div class="mat-subheading-1" style="margin-top: 24px;">{{nft.description}}</div>
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
