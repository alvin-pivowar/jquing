using System;
using System.Globalization;
using jquing.ViewModels;

namespace jquing.Controllers
{
    using System.Web.Http;

    [RoutePrefix("jquing/time")]
    public class TimeServiceController : ApiController
    {
        [Route("local-time")]
        [HttpGet]
        public IHttpActionResult GetLocalTime()
        {
            var now = DateTime.Now;

            return Ok(new TimeResponse
            {
                date = new TimeResponse.Date
                {
                    day = new TimeResponse.DatePart
                    {
                        longDisplayName = CultureInfo.CurrentCulture.DateTimeFormat.GetDayName(now.DayOfWeek),
                        ordinal = now.Day,
                        shortDisplayName = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedDayName(now.DayOfWeek)
                    },
                    month = new TimeResponse.DatePart
                    {
                        longDisplayName = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(now.Month),
                        ordinal = now.Month,
                        shortDisplayName = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(now.Month)
                    },
                    year = now.Year
                },
                time = new TimeResponse.Time
                {
                    hour = now.Hour,
                    meridiem = (now.Hour < 13) ? "ante" : "post",
                    minute = now.Minute,
                    second = now.Second
                }
            });
        }
    }
}
