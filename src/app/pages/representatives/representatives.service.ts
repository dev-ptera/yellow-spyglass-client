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
        let url = rep.ip;
        url = url.replace('/api.php', '');
        url = url.replace('/api', '');


        if (url.includes('http') || url.includes('https')) {
            return url;
        }
        return `http://${url}`;
    }

    formatVersion(version: string): string {
        if (version) {
            return version.toUpperCase().replace('BANANO', '');
        }
        return '';
    }
}
