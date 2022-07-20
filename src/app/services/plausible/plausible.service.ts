// @ts-nocheck
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root',
})
/**
 /** Adds Plausible analytics to the app in a way that does not block the rest of the application from loading.
 */
export class PlausibleService {


    /** Call this function whenever the application loads; adds the plausible analytics to the app. */
    loadAnalytics(): void {
        this._loadScript('https://plausible.banano.cc/js/script.outbound-links.js', () => {
            window.plausible =
                window.plausible ||
                function () {
                    (window.plausible.q = window.plausible.q || []).push(arguments);
                };
        })
    }

    // https://stackoverflow.com/questions/7718935/load-scripts-asynchronously
    private _loadScript(src, callback): void
    {
        let s,
            r,
            t;
        r = false;
        s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = src;
        s.onload = s.onreadystatechange = () => {
            //console.log( this.readyState ); //uncomment this line to see which ready states are called.
            if ( !r && (!document.readyState || document.readyState == 'complete') )
            {
                r = true;
                callback();
            }
        };
        t = document.getElementsByTagName('script')[0];
        t.parentNode.insertBefore(s, t);
    }
}
