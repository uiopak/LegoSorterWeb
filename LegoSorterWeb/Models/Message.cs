namespace LegoSorterWeb.Models
{
    public partial class Message
    {
        public int ymin { get; set; }
        public int xmin { get; set; }
        public int ymax { get; set; }
        public int xmax { get; set; }
        public string label { get; set; }
        public float score { get; set; }
    }
}
