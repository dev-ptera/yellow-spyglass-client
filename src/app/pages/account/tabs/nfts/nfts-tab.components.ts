import {Component, Input, ViewEncapsulation} from '@angular/core';
import {AccountNFTDto} from "@app/types/dto";

@Component({
    selector: 'account-nfts-tab',
    styleUrls: [`nfts-tab.component.scss`],
    template: `
        <div class="nfts-tab-container">
            <mat-divider *ngIf="nfts && nfts.length > 0"></mat-divider>

            <mat-card *ngIf="!nfts || nfts.length === 0" class="divider-border" style="padding: 0">
                <div class="mat-headline" *ngIf="isLoadingNFTs" style="padding: 32px">
                    Loading...
                </div>

                <blui-empty-state *ngIf="!isLoadingNFTs && nfts.length === 0"
                    responsive
                    class="tab-empty-state"
                    title="No NFTs">
                    <mat-icon blui-empty-icon>image</mat-icon>
                    <div blui-description>
                        This account currently owns no NFTs.
                        Learn more about Banano NFTs
                        <a class="primary" href="https://www.reddit.com/r/banano/comments/v8ttyh/banano_nft_metaprotocol_specification_v100_release/" target="_blank">here</a>.
                    </div>
                </blui-empty-state>
                <app-error  *ngIf="hasError" class="tab-empty-state mat-elevation-z0 divider-border"></app-error>
            </mat-card>


            <div *ngIf="!isLoadingNFTs" class="nft-body-container" responsive>
                <ng-container *ngIf="nfts.length !== 0">
                    <mat-card *ngFor="let nft of nfts" class="divider-border">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px">
                            <div>
                                <div class="mat-title" style="margin-bottom: 0;">{{nft.name}}</div>
                                <div class="mat-body-2 text-secondary">Owns x{{nft.quantity}}</div>
                            </div>
                            <div>
                                <button mat-icon-button (click)="nft.isExpanded = !nft.isExpanded">
                                    <mat-icon>expand_more</mat-icon>
                                </button>
                            </div>
                        </div>
                        <mat-divider></mat-divider>
                        <div [style.height.px]="nft.isExpanded ? 170 : 0" style="overflow: hidden; transition: all 250ms ease-in-out">
                            <div style="margin-top: 24px;">More Info goes here.</div>
                            <div>Receive Date</div>
                            <div>Receive Hash</div>
                            <div>Mintage Hash</div>
                            <div style="margin-bottom: 24px">Minted By</div>
                            <mat-divider *ngIf="nft.isExpanded"></mat-divider>
                        </div>
                        <img [src]="ipfsUrl + nft.image" loading="lazy" style="width: 100%; margin: 16px 0">
                        <mat-divider></mat-divider>
                        <div class="mat-subheading-1" style="margin-top: 24px;">{{nft.description}}</div>
                    </mat-card>
                </ng-container>
            </div>
        </div>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class NftsTabComponents {

    ipfsUrl = 'https://ipfs.io/ipfs/';

    @Input() address: string;
    @Input() isLoadingNFTs: boolean;
    @Input() nfts: AccountNFTDto[] = [];
    @Input() hasError: boolean;
}
