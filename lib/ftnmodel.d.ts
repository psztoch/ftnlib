/// <reference path="../../../source/app/ftnlib/ftnlib.d.ts" />
/// <reference path="../../../source/typings/ftn.d.ts" />
declare module ftneditor {
    class SceneModel {
        scenePrefix: string;
        extensions: Array<string>;
        place: string;
        subplace: string;
        placeParts: Array<string>;
        timeShift: string;
        raw: string;
        constructor(text: string);
    }
    class FtnModel {
        static SCENE_PREFIXES: {
            en: string[];
            pl: string[];
        };
        static SCENE_EXTENSIONS: {
            en: string[];
            pl: string[];
        };
        static SCENE_EXTENSIONS_SEARCH_ARRAY: string[];
        private ftnExt;
        constructor();
        buildModel(screenplay: string): void;
        getDescription(): string;
        getModel(): Array<any>;
        getScenes(): Array<{
            sceneNo: string;
            intExt: string;
            placeName: string;
            placeExt: string;
            dayNight: string;
            time: string;
            sceneSynopsis: string;
        }>;
        getSections(): Array<{
            sectionNo: string;
            sectionName: string;
            sectionSynopses: string;
            characters: string;
            characterArray: Array<string>;
            time: string;
            cumulativeTime;
        }>;
        getCharacters(): Array<{
            characterName: string;
            numberOfAppearances: number;
        }>;
        getPlaces(): Array<{
            placeName: string;
            numberOfAppearances: number;
        }>;
        getTitlePage(): Array<{
            keyName: string;
            value: string;
        }>;
        static formatTimeR(timeAssigned: any, timeComputed: any, timeStart: any): string;
        static formatTime(duration: any): string;
        static getPlaceHeaders(): Array<string>;
        static getCharacterHeaders(): Array<string>;
        static getSceneHeaders(): Array<string>;
        static getSectionHeaders(): Array<string>;
        static getTitlePageHeaders(): Array<string>;
        static toCamelCase(s: string): string;
        static getAsHtmlTable(headers: Array<string>, data: Array<any>): string;
        static countArray(arr: Array<string>): Array<{
            key: string;
            value: number;
        }>;
    }
}
