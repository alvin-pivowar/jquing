namespace jquing.ViewModels
{
    public class TimeResponse
    {
        public Date date { get; set; }
        public Time time { get; set; }

        public class Date
        {
            public DatePart day { get; set; }
            public DatePart month { get; set; }
            public int year { get; set; }
        }

        public class DatePart
        {
            public string longDisplayName { get; set; }
            public int ordinal { get; set; }
            public string shortDisplayName { get; set; }
        }

        public class Time
        {
            public int hour { get; set; }
            public string meridiem { get; set; }
            public int minute { get; set; }
            public int second { get; set; }
        }
    }
}