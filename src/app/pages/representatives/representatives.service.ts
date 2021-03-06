import { Injectable } from '@angular/core';
import { MonitoredRepDto } from '@app/types/dto';

@Injectable({
    providedIn: 'root',
})
export class RepresentativesService {
    openMonitoredRep(rep: MonitoredRepDto): void {
        window.open(this.getMonitoredRepUrl(rep), '_blank');
    }

    getMonitoredRepUrl(rep: MonitoredRepDto): string {
        if (rep.ip.includes('http') || rep.ip.includes('https')) {
            return rep.ip;
        }
        return `http://${rep.ip}`;
    }

    formatVersion(version: string): string {
        if (version) {
            return version.toUpperCase().replace('BANANO', '');
        }
        return '';
    }
}
