/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import { declared, property, subclass } from "esri/core/accessorSupport/decorators";
import Accessor = require("esri/core/Accessor");

// esri.views
import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");
import Extent = require("esri/geometry/Extent");
import watchUtils = require('esri/core/watchUtils');

interface SwitchExtentModelProperties {
    view: MapView | null,
    count: number,
    isPreviousDisabled: boolean,
    isNextDisabled: boolean,
    stationaryWatching: any,
    dragWatching: any,
    arrayPreviousExtents: Array<Extent>,
    arrayNextExtents: Array<Extent>,
    prevExtent: Extent | null,
    lastArrayExtentString: string,
    currentExtentString: string
}


@subclass("esri.widgets.SwitchExtentModel")
class SwitchExtentModel extends declared(Accessor) {

    constructor(properties?: SwitchExtentModelProperties) {
        super();
    }


    //--------------------------------------------------------------------
    //
    //  Properties
    //
    //--------------------------------------------------------------------

    //propertie shared
    @property()
    view: MapView | SceneView;

    @property()
    count: number;

    @property()
    isPreviousDisabled: boolean;

    @property()
    isNextDisabled: boolean;

    @property()
    stationaryWatching: any;

    @property()
    dragWatching: any;

    //properties for the workflow
    @property()
    arrayPreviousExtents: Array<Extent>;

    @property()
    arrayNextExtents: Array<Extent>;

    @property()
    prevExtent: Extent | null;

    @property()
    lastArrayExtentString: string;

    @property()
    currentExtentString: string;

    //--------------------------------------------------------------------
    //
    //  Methods use for watching
    //
    //--------------------------------------------------------------------

    // variable activate & deactivate event
    private _activateExtentWatching = () => this.stationaryWatching = watchUtils.whenTrue(this.view, "stationary", this._onMoveEnd);
    private _activateDragHandler = () => this.dragWatching = this.view.on('drag', event => this._onDrag(event));

    private _deactivateExtentWatching = () => this.stationaryWatching.remove();
    private _deactivateDragWatching = () => this.dragWatching.remove();
    //activate watching view
    handleMoveView = (): void => {
        //initialize array
        this.arrayPreviousExtents = [];
        this.arrayNextExtents = [];

        //when view ready
        this.view.when()
            .then(_ => this._noChange())
            .then(_ => this._activateExtentWatching());
    }

    //--------------------------------------------------------------------
    //
    //  Clicks action
    //
    //--------------------------------------------------------------------

    //handle click and set previous extent is array length > 0
    onPreviousClick = (): void => {
        //push current view to the next array
        this.arrayNextExtents.push(this.view.extent);
        //reinitialize previous extent properties
        this.prevExtent = null;
        this.arrayPreviousExtents.length > 0 ? this._setExtent() : null;
    }


    //handle click and set previous extent is array length > 0
    onNextClick = (): void => {
        this._activateDragHandler();
        //reinitialize previous extent properties
        this.view.extent = this.arrayNextExtents[this.arrayNextExtents.length - 1];
        this.arrayNextExtents.splice(this.arrayNextExtents.length - 1);
    }

    //--------------------------------------------------------------------
    //
    //  Privates methods
    //
    //--------------------------------------------------------------------

    //when view stationnary execute push extent
    private _onMoveEnd = (event: boolean): void => {
        event ? this._noChange() : null;
    }

    //when view stationnary execute push extent
    private _onDrag = (event: any): void => {
        event.action === 'end' ? this._emptyNextArray() : null;
    }

    private _emptyNextArray = (): void => {
        this.arrayNextExtents = [];
        this._deactivateDragWatching();
    }

    //goal : pushing new extent in array
    private _noChange = (): void => {
        // stringify current extent & last entry in arrat view
        this.currentExtentString = JSON.stringify(this.view.extent);
        this.lastArrayExtentString = JSON.stringify(this.arrayPreviousExtents[this.arrayPreviousExtents.length - 1]);

        // if a previous extent exists, we compare it with the current and if it's egal, no push (use in the clicking process)
        // else we compare actual extent et last entry in array (use during the first initialize of watching)
        if (this.prevExtent) {
            const prevExtentToString = JSON.stringify(this.prevExtent);
            this.currentExtentString !== prevExtentToString ? this._pushExtent() : null;
        } else {
            this.lastArrayExtentString !== this.currentExtentString ? this._pushExtent() : null;
        }
        this._activateButton();
    }

    private _pushExtent = (): void => {
        //check the limit of the array defined by users
        this.arrayPreviousExtents.length === this.count ? this.arrayPreviousExtents.splice(0, 1) : null;
        //push the extent in the array
        this.arrayPreviousExtents.push(this.view.extent);
        //update the properties array
        this.lastArrayExtentString = JSON.stringify(this.arrayPreviousExtents[this.arrayPreviousExtents.length - 1]);
    }

    private _setExtent = (): void => {
        //if last extent in the array is egal to the current extent and array length > 1, remove this value
        this.lastArrayExtentString === this.currentExtentString && this.arrayPreviousExtents.length > 1 ? this.arrayPreviousExtents.splice(this.arrayPreviousExtents.length - 1) : null;
        this.view.extent = this.arrayPreviousExtents[this.arrayPreviousExtents.length - 1];
        this.prevExtent = this.view.extent;
        this.arrayPreviousExtents.length > 1 ? this.arrayPreviousExtents.splice(this.arrayPreviousExtents.length - 1) : this.isPreviousDisabled = true;
    }

    private _activateButton = (): void => {
        this.arrayNextExtents.length === 0 ? this.isNextDisabled = true : this.isNextDisabled = false;
        this.currentExtentString === JSON.stringify(this.arrayPreviousExtents[0]) ? this.isPreviousDisabled = true : this.isPreviousDisabled = false;
    }
}

export = SwitchExtentModel;