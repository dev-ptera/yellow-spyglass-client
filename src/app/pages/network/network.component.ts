import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
// eslint-disable-next-line no-duplicate-imports
import * as Highcharts from 'highcharts';
import { Options } from 'highcharts';
import HC_bullet from 'highcharts/modules/bullet';
import { ViewportService } from '@app/services/viewport/viewport.service';
import { ApiService } from '@app/services/api/api.service';
import { ConsensusStatsDto, NetworkStatsDto, QuorumDto, SupplyDto } from '@app/types/dto';

HC_bullet(Highcharts);

@Component({
    selector: 'app-page-one',
    templateUrl: './network.component.html',
    styleUrls: ['./network.component.scss'],
})
export class NetworkComponent implements OnInit {
    Highcharts: typeof Highcharts = Highcharts;

    loading = true;
    error = false;

    supplyChartOptions: Options;
    consensusChartOptions: Options;

    consensus: ConsensusStatsDto;
    supply: SupplyDto;
    QuorumDto: QuorumDto;
    nakamotoCoefficient: number;

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
        void this._apiService
            .getNetworkStats()
            .then((response: NetworkStatsDto) => {
                this.consensus = response.consensus;
                this.supply = response.supply;
                this.QuorumDto = response.quorum;
                this.nakamotoCoefficient = response.nakamotoCoefficient;
                this.consensusChartOptions = this._createConsensusChart(response.consensus);
                this.supplyChartOptions = this._createsupplyChart(response.supply);
                this.loading = false;
            })
            .catch((err) => {
                console.error(err);
                this.error = true;
                this.loading = false;
            });
    }

    private _createsupplyChart(supply: SupplyDto): Options {
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
                    colors: ['#FBDD11', '#4CBF4B'],
                    data: [
                        {
                            name: 'Circulating',
                            y: supply.circulatingAmount,
                        },
                        {
                            name: 'Team Funds',
                            y: supply.devFundAmount,
                        },
                    ],
                    dataLabels: {
                        enabled: true,
                        distance: 10,
                        style: { fontSize: '14px', fontWeight: '400', fontFamily: 'Open Sans', color: '#424e54' },
                        format: '{point.name}: <br/><strong>{point.percentage:.1f}%</strong>',
                    },
                },
            ],
        };
    }

    private _createConsensusChart(consensus: ConsensusStatsDto): Options {
        const format = (num: number): number => Number(parseFloat(String(num * 100)).toFixed(2));
        const data = [
            ['Official Online', format(consensus.official.onlinePercent)],
            ['Unofficial Online', format(consensus.unofficial.onlinePercent)],
            ['Unofficial Offline', format(consensus.unofficial.offlinePercent)],
            ['No Rep', format(consensus.noRep.percent)],
        ];
        if (this.consensus.official.offlineAmount !== 0) {
            data.push(['Official Offline', format(consensus.official.offlinePercent)]);
        }
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
                    colors: ['#FBDD11', '#4CBF4B', 'red', 'gray'],
                    data,
                    dataLabels: {
                        enabled: true,
                        distance: 25,
                        style: { fontSize: '14px', fontWeight: '400', fontFamily: 'Open Sans', color: '#424e54' },
                        format: '{point.name}: <br/><strong>{point.percentage:.1f}%</strong>',
                    },
                },
            ],
        };
    }
}
