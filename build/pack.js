import fs from "fs";
import path from "path";

function copyFiles(srcDir, distDir, paths = []) {
    // Loop through the contents of the source directory
    fs.readdirSync(srcDir, { withFileTypes: true }).forEach((entry) => {
        const srcPath = path.join(srcDir, entry.name);
        const distPath = path.join(distDir, entry.name);

        // If the entry is a directory, recursively copy its contents
        if (entry.isDirectory()) {
            copyFiles(srcPath, distPath, [ ...paths, distDir ]);
        }

        // If the entry is a file, copy it to the destination directory
        else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();

            // Copy HTML, CSS, and image files
            if (!([".ts", ".tsx", ".scss", "tsconfig.json"]).includes(ext)) {
                // Create the destination directory if it doesn't exist
                if (!fs.existsSync(distDir)) {
                    for(let path of paths) {
                        if(!fs.existsSync(path))
                            fs.mkdirSync(path);
                    }

                    fs.mkdirSync(distDir);
                }

                fs.copyFileSync(srcPath, distPath);
            }
        }
    });
}

if(fs.existsSync(".build"))
    throw new Error("Build already exists, delete previous build through: npm run clear");

fs.mkdirSync(".build");

copyFiles("src/client", ".build");
