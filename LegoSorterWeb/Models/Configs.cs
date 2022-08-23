namespace LegoSorterWeb.Models
{
    public partial class Configs
    {
        public string capture_mode_preference { get; set; }
        public string capture_resolution_value { get; set; }
        public string analysis_resolution_value { get; set; }
        public string exposure_compensation_value { get; set; }
        public bool manual_settings { get; set; }
        public string sensor_exposure_time { get; set; }
        public string sensor_sensitivity { get; set; }
        public int sorter_conveyor_speed_value { get; set; }
        public string sorter_mode_preference { get; set; }
        public string run_conveyor_time_value { get; set; }
        public string analysis_minimum_delay { get; set; }
        public string render_belt_speed { get; set; }
        public string render_belt_opacity { get; set; }
        public bool render_belt_camera_view { get; set; }
    }
}
