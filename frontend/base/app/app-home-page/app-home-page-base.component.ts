import { BaseAppConstants } from "@baseapp/app-constants.base";
import { AppHomeBaseService } from "./app-home.service.base";
import { AppUtilService } from '@app/app.util.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from "@ngx-translate/core";
import { inject } from "@angular/core";
import { Router } from "@angular/router";

export class AppHomePageBaseComponent {

    tiles: any;
    tilesPerRow: any = 4
    isMobile: boolean = BaseAppConstants.isMobile;
    tileWidth: any = "20%"
    displayMenus = false;
    svgContents:any;
    svgFiles: string[] = []
    sanitizedSVGs: { [key: string]: SafeHtml } = {};
    public bs = inject(AppHomeBaseService);
    public utilBase = inject(AppUtilService);
    public _sanitize = inject(DomSanitizer);
    public translateService = inject(TranslateService);
    public sanitizer = inject(DomSanitizer);
    public router = inject(Router);

    onInit(): void {
        this.tiles = this.bs.getLandingPageData()
        let tiles = this.tiles.data?.properties?.numberOfTilesPerRow
        this.tilesPerRow = tiles
        if (tiles == 3) {
            this.tileWidth = "30%"
        } else if (tiles == 4) {
            this.tileWidth = "20%"
        } else if (tiles == 5) {
            this.tileWidth = "15%"
        } else if (tiles > 5) {
            this.tilesPerRow = 6
            this.tileWidth = "10%"
        } else {
            this.tilesPerRow = 5
        }
        this.findSVGFiles()
        this.fetchMultipleSVGs(this.svgFiles).then(contents => {
            this.svgContents = contents;
            this.sanitizeSVGs();
        }).catch(error => console.error('Error loading SVGs:', error));
    }

    findSVGFiles() {
        this.svgFiles = [];
        this.tiles.children.forEach((tile: any) => {
            const properties = tile.data.properties;
            if (properties.image) {
                properties.image.icon.forEach((icon: { fileName: string }) => {
                    if (icon.fileName.endsWith('.svg')) {
                        this.svgFiles.push(icon.fileName);
                    }
                });
            }
        });
    }
    sanitizeSVGs() {
        Object.keys(this.svgContents).forEach(fileName => {
            this.svgContents[fileName] = this.utilBase.sanitizeSvg(this.svgContents[fileName]);
        });
    }
    fetchMultipleSVGs(fileNames: string[]): Promise<{ [key: string]: string }> {
        const fetchPromises = fileNames.map(file =>
            fetch(`assets/images/${file}`)
                .then(response => response.text())
                .then(content => ({ [file]: content })) // Return object with filename as key
        );

        return Promise.all(fetchPromises).then(results => {
            return results.reduce((acc, result) => {
                return { ...acc, ...result };
            }, {});
        });
    }

    getImageUrl(tile: any) {
        if (tile.data.properties?.image.icon) {
            return "assets/images/" + tile.data.properties?.image?.icon[0]?.fileName
        } else {
            return ""
        }
    }

    isSvgImage(tile: any): boolean {
        const imageName = tile.data.properties?.image?.icon[0]?.fileName;
        if (imageName && imageName.endsWith('.svg')) {
            return true;
        }
        return false;
    }

    getSanitizedContent(label: string) {
        if (!label) return ;
        return this.utilBase.sanitizeHtml(this.translateService.instant(label));
    }

    getStyles() {
        let value: any
        if (this.tiles.data?.properties?.backgroundImage?.type == 'uploaded') {
            value = `url('assets/images/${this.tiles.data?.properties?.backgroundImage?.icon[0].fileName}')`
        } else {
            value = this.tiles.data?.properties?.backgroundColor
        }
        let styleObj: any = {
            "background": value
        };
        return styleObj;
    }

    onTileClick(event: Event, tile: any): void {
        // Prevent default only for tiles that need special handling
        const tileProps = tile.data?.properties;

        // Check if cross-app navigation is needed
        if (this.utilBase.isCrossAppNavigation(tileProps)) {
            event.preventDefault();
            this.utilBase.navigateWithContextPath(tileProps);
            return;
        }

        // Handle onClick property for different navigation types
        if (tileProps?.onClick === 'navigate_to_page') {
            event.preventDefault();
            const url = tileProps?.customUrl || tileProps?.page?.url;
            if (url) {
                this.router.navigateByUrl(url);
            }
        } else if (tileProps?.onClick === 'navigate_to_url' || tileProps?.onClick === 'open_external_url') {
            event.preventDefault();
            const externalUrl = tileProps?.url || tileProps?.link;
            if (externalUrl) {
                if (!this.utilBase.isSafeUrl(externalUrl)) {
                     console.warn("Naviagtion blocked to unsafe url ",externalUrl);
                     return;
                }
                window.location.href = externalUrl;
            }
        }
        // For other cases, let the default anchor behavior handle it
    }

    /**
     * Check if tile requires cross-app navigation
     * @param tile - tile configuration object
     * @returns true if cross-app navigation is needed
     */
    isCrossAppTile(tile: any): boolean {
        return this.utilBase.isCrossAppNavigation(tile.data?.properties);
    }

    /**
     * Get href for tile anchor tag
     * For cross-app navigation, return null (handled by click event)
     * For same-app navigation, return the URL
     */
    getTileHref(tile: any): string | null {
        const props = tile.data?.properties;

        // If cross-app navigation, handle in click event
        if (this.utilBase.isCrossAppNavigation(props)) {
            return null;
        }

        // Return appropriate URL based on configuration
        if (props?.page?.url) {
            return this.utilBase.getTabPageUrl(props.page.url) || props.page.url;
        } else if (props?.link || props?.url) {
            return props.link || props.url;
        }

        return null;
    }

    /**
     * Get target attribute for tile anchor tag
     */
    getTileTarget(tile: any): string | null {
        const props = tile.data?.properties;

        // Cross-app navigation handled in click event
        if (this.utilBase.isCrossAppNavigation(props)) {
            return null;
        }

        // External links open in new tab
        if (props?.onClick === 'navigate_to_url' || props?.onClick === 'open_external_url') {
            return '_blank';
        }

        // Check if it's an external URL
        if (props?.link || props?.url) {
            return '_blank';
        }

        return null;
    }
}
