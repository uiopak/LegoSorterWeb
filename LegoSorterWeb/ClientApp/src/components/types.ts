export type Configs = {
    capture_mode_preference: string,
    capture_resolution_value: string,
    analysis_resolution_value: string,
    exposure_compensation_value: string,
    manual_settings: boolean,
    sensor_exposure_time: string,
    sensor_sensitivity: string,
    sorter_conveyor_speed_value: number,
    sorter_mode_preference: string,
    run_conveyor_time_value: string,
    analysis_minimum_delay: string,
    render_belt_speed: string,
    render_belt_opacity: string,
    render_belt_camera_view: boolean
};

export type ConfigsConstraints = {
    cameraCompensationRangeMin: number,
    cameraCompensationRangeMax: number,
    exposureTimeRangeMin: number,
    exposureTimeRangeMax: number,
    sensitivityRangeMin: number,
    sensitivityRangeMax: number,
};

export interface ConfigServerType {
    option: string,
    value: string,
};

export type MessageItem = { ymin: number, xmin: number, ymax: number, xmax: number, label: string, score: number, label_top5: [string], score_top5: [number], id: string, session: string };
export type LegoItemMessage = { partNo: string, x: number, y: number, z: number };
export type QueuesInfoMessageItem = { lastImages_length: number, storage_queue_length: number, processing_length: number, annotation_length: number, sort_length: number, crops_length: number };
export type LegoModelItem = { model: THREE.Group, refMes: LegoItemMessage };
export type SortItem = { label: string, score: number, info: string, id: string, session: string };