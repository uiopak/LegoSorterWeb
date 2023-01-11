namespace LegoSorterWeb.Models
{
    public partial class QueuesInfoMessage
    {
        public int lastImages_length { get; set; }
        public int storage_queue_length { get; set; }
        public int processing_length { get; set; }
        public int annotation_length { get; set; }
        public int sort_length { get; set; }
        public int crops_length { get; set; }
    }
}
