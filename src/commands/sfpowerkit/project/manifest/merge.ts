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
  "project_manifest_merge"
);

export default class Merge extends SfdxCommand {
  public output: Map<string, string[]>;

  public static description = messages.getMessage("commandDescription");

  public static examples = [
    `$ sfdx sfpowerkit:project:manifest:merge -p project1/path/to/package.xml -d result/package.xml\n` +
      `$ sfdx sfpowerkit:project:manifest:merge -p project1/path/to/package.xml,project2/path/to/package.xml -d result/package.xml`
  ];

  protected static flagsConfig = {
    path: flags.array({
      required: false,
      char: "p",
      description: messages.getMessage("pathFlagDescription")
    }),
    manifest: flags.string({
      required: false,
      char: "d",
      description: messages.getMessage("manifestFlagDescription")
    }),
    apiversion: flags.builtin({
      description: messages.getMessage("apiversion")
    }),
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

    var parser = new xml2js.Parser();
    fs.readFile("./package/package.xml", function(err, data) {
      parser.parseString(data, function(err, result) {
        result.Package.types.forEach(element => {
          if (element.name == "ApexClass") {
            element.members.forEach(cls => {
              if (
                cls.startsWith("Test") ||
                cls.startsWith("test") ||
                cls.endsWith("Test") || cls.endsWith("test")
              ) {
                fs.appendFile("./testsToRun/testFile.txt", cls + ",", function(
                  err
                ) {
                  if (err) throw err;
                });
                console.log(cls);
              }
            });
          }
        });
      });
    });

    return null;
  }
}
