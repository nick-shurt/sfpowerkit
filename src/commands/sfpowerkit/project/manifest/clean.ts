import { core, flags, SfdxCommand } from "@salesforce/command";
import { AnyJson } from "@salesforce/ts-types";

core.Messages.importMessagesDirectory(__dirname);

const messages = core.Messages.loadMessages(
	"sfpowerkit",
	"project_manifest_clean"
);

export default class Clean extends SfdxCommand {
	public static description = messages.getMessage("commandDescription");

	public static examples = [
		`$ sfdx sfpowerkit:project:manifest:clean`
	];

  	protected static flagsConfig = {
    	loglevel: flags.enum({
    		description: messages.getMessage("loglevel"),
			default: "info",
			required: false,
			options: [
			"trace",
			"debug",
			"info",
			"warn",
			"error",
			"fatal",
			"TRACE",
			"DEBUG",
			"INFO",
			"WARN",
			"ERROR",
			"FATAL"
			]
    	})
  	};

	public async run(): Promise<AnyJson> {
		var fs = require("fs"),
		xml2js = require("xml2js");

		fs.readFile("./package/package.xml", function(err, data) {
			if (err) { throw err; }

			xml2js.parseString(data, (err, result) => {
				if (err) { throw err; }
				
				result.Package.types.forEach(type => {
					if (type.name == "CustomLabel") {
						type.members = "*";
						type.name = "CustomLabels";
					}
				});

				const builder = new xml2js.Builder();
				const xml = builder.buildObject(result);

				fs.writeFile('./package/package.xml', xml, (err) => {
					if (err) { throw err; }
					console.log(`Updated XML is written to a new file.`);
				});
			});
		});
		return null;
	}
}
