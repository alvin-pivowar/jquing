using System.Linq;
using jquing;
using Microsoft.Owin;

[assembly: OwinStartup(typeof(Startup))]
namespace jquing
{
    using System.Web.Http;
    using Microsoft.Owin;
    using Microsoft.Owin.Extensions;
    using Microsoft.Owin.FileSystems;
    using Microsoft.Owin.StaticFiles;
    using Owin;

    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var httpConfiguration = new HttpConfiguration();

            // Use routing attributes.
            httpConfiguration.MapHttpAttributeRoutes();

            // Old-style routing.
            //httpConfiguration.Routes.MapHttpRoute(
            //    name: "DefaultApi",
            //    routeTemplate: "api/{controller}/{id}",
            //    defaults: new { id = RouteParameter.Optional }
            //);

            app.UseWebApi(httpConfiguration);

            // JSON payload by default.
            var appXmlType = httpConfiguration.Formatters.XmlFormatter.SupportedMediaTypes.FirstOrDefault(t => t.MediaType == "application/xml");
            httpConfiguration.Formatters.XmlFormatter.SupportedMediaTypes.Remove(appXmlType);

            // Make ./public the default root of the static files in our Web Application.
            app.UseFileServer(new FileServerOptions
            {
                RequestPath = new PathString(string.Empty),
                FileSystem = new PhysicalFileSystem("./public"),
                EnableDirectoryBrowsing = false,
            });

            app.UseStageMarker(PipelineStage.MapHandler);
        }
    }
}
