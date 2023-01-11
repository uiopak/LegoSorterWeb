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
        public string[] label_top5 { get; set; }
        public float[] score_top5 { get; set; }
        public string id { get; set; }
        public string session { get; set; }
    }
}
