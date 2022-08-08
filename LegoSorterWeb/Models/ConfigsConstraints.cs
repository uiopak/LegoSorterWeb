namespace LegoSorterWeb.Models
{
    public partial class ConfigsConstraints
    {
        public int cameraCompensationRangeMin { get; set; }
        public int cameraCompensationRangeMax { get; set; }
        public double exposureTimeRangeMin { get; set; }
        public double exposureTimeRangeMax { get; set; }
        public int sensitivityRangeMin { get; set; }
        public int sensitivityRangeMax { get; set; }
    }
}
