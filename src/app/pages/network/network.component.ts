import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
// eslint-disable-next-line no-duplicate-imports
import * as Highcharts from 'highcharts';
import { Options } from 'highcharts';
import HC_bullet from 'highcharts/modules/bullet';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ApiService } from '@app/services/api/api.service';
import { PeerVersionsDto, QuorumDto, SupplyDto } from '@app/types/dto';
import { APP_NAV_ITEMS } from '../../navigation/nav-items';

HC_bullet(Highcharts);

@Component({
    selector: 'app-page-one',
    templateUrl: './network.component.html',
    styleUrls: ['./network.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NetworkComponent implements OnInit {
    Highcharts: typeof Highcharts = Highcharts;

    isLoading = true;
    hasError = false;

    navItems = APP_NAV_ITEMS;

    supplyChartOptions: Options;
    consensusChartOptions: Options;

    supply: SupplyDto;
    quorum: QuorumDto;
    peerVersions: PeerVersionsDto[];

    totalNumberOfPeers = 0;
    nakamotoCoefficient: number;
    minWeightCoefficient: number;

    constructor(
        public vp: ViewportService,
        private readonly _apiService: ApiService,
        private readonly _ref: ChangeDetectorRef
    ) {
        this.vp.vpChange.subscribe(() => {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            });
        });
    }

    ngOnInit(): void {
        Promise.all([
            this._apiService.fetchSupplyStats(),
            this._apiService.fetchPeerVersions(),
            this._apiService.fetchNakamotoCoefficient(),
            this._apiService.fetchMinWeightCoefficient(),
            this._apiService.fetchQuorumStats(),
        ])
            .then((response) => {
                this.supply = response[0];
                this.peerVersions = response[1];
                this.nakamotoCoefficient = response[2].nakamotoCoefficient;
                this.minWeightCoefficient = response[3].coefficient;
                this.quorum = response[4];
                this.consensusChartOptions = this._createVoteWeightChart(this.quorum);
                this.supplyChartOptions = this._createSupplyChart(this.supply);
                this.peerVersions.map((version) => {
                    this.totalNumberOfPeers += version.count;
                });
            })
            .catch((err) => {
                console.error(err);
                this.hasError = true;
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    calcPeerVersionPercentage(count: number): any {
        return Math.round((count / this.totalNumberOfPeers) * 100);
    }

    private _createSupplyChart(supply: SupplyDto): Options {
        return {
            tooltip: {
                enabled: false,
            },
            credits: {
                enabled: false,
            },
            title: {
                text: '',
            },
            series: [
                {
                    name: 'supply',
                    type: 'pie',
                    colors: ['#4CBF4B', '#FBDD11'],
                    data: [
                        {
                            name: 'Circulating',
                            y: supply.circulatingAmount,
                        },
                        {
                            name: 'Distribution Funds',
                            y: supply.devFundAmount,
                        },
                    ],
                    dataLabels: {
                        enabled: true,
                        distance: 10,
                        style: {
                            fontSize: this.vp.sm ? '12px' : '14px',
                            fontWeight: '400',
                            fontFamily: 'Open Sans',
                            color: '#424e54',
                            textOutline: 'none',
                        },
                        format: '{point.name}: <br/><strong>{point.percentage:.1f}%</strong>',
                    },
                },
            ],
        };
    }

    private _createVoteWeightChart(quorum: QuorumDto): Options {
        const format = (num: number): number => Number(parseFloat(String(num * 100)).toFixed(2));
        const data = [
            ['Online', format(quorum.onlinePercent)],
            ['Offline', format(quorum.offlinePercent)],
            ['No Rep', format(quorum.noRepPercent)],
        ];
        return {
            plotOptions: {
                pie: {
                    innerSize: '80%',
                },
            },
            credits: {
                enabled: false,
            },
            tooltip: {
                enabled: false,
            },
            title: {
                text: '',
            },
            series: [
                {
                    name: 'Consensus',
                    type: 'pie',
                    colors: ['#4CBF4B', '#FBDD11', 'red'],
                    data,
                    dataLabels: {
                        enabled: true,
                        distance: 25,
                        style: {
                            fontSize: this.vp.sm ? '12px' : '14px',
                            fontWeight: '400',
                            fontFamily: 'Open Sans',
                            color: '#424e54',
                            textOutline: 'none',
                        },
                        format: '{point.name}: <br/><strong>{point.percentage:.1f}%</strong>',
                    },
                },
            ],
        };
    }
}
