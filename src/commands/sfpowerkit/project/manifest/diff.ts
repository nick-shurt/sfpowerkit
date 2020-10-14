import { core, flags, SfdxCommand } from "@salesforce/command";
import { AnyJson } from "@salesforce/ts-types";
import * as fs from "fs-extra";
import * as path from "path";
import { SFPowerkit, LoggerLevel } from "../../../../sfpowerkit";
import xmlUtil from "../../../../utils/xmlUtil";
import getDefaults from "../../../../utils/getDefaults";

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = core.Messages.loadMessages(
	"sfpowerkit",
	"project_manifest_diff"
);

export default class Diff extends SfdxCommand {
	public static description = messages.getMessage("commandDescription");

	public static examples = [
		`$ sfdx sfpowerkit:project:manifest:diff -s source/package.xml -t target/package.xml -d output`
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
				//var objArray = [];
				
				result.Package.types.forEach(type => {
					if (type.name == "CustomLabel") {
						console.log(type);
						type = undefined;
						result.Package.types.push({members: '*', name: 'CustomLabels'});
					}
					/*if (type.name == "CustomField") {
						type.members.forEach(member => {
							var sObject = member.substr(0, member.indexOf('.'));
							objArray.push(sObject);
						});
					}*/
				});

				//if (Array.isArray(objArray) && objArray.length) {
					//result.Package.types.push({members: objArray[0], name: 'CustomObject'});
				//}

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
