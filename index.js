#!/usr/bin/env node

import { program } from 'commander';
import { execSync } from 'child_process';
import inquirer from 'inquirer';
import fs from 'fs';

program
    .version('0.0.4')
    .command('create')
    .description('Create une application angular, en utilisant mon template Tailwind.')
    .action(async () => {
        try {
            const {name, tailwind} = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the name of your project?'
                },
                {
                    type: 'confirm',
                    name: 'tailwind',
                    message: 'Do you want to use Tailwind CSS?',
                    default: true
                },
            ]);

            // On créer l'application Angular
            execSync(`npx @angular/cli new ${name} --style=css`, { stdio: 'inherit' });
            if(tailwind) {
                // On installe Tailwind CSS
                execSync(`cd ${name} && npm install tailwindcss`, { stdio: 'inherit' });

                // On génère le fichier de configuration de Tailwind CSS
                execSync(`cd ${name} && npx tailwindcss init`, { stdio: 'inherit' });

                // On ajoute Tailwind CSS au fichier de styles
                fs.appendFileSync(`${name}/src/styles.css`, `@import 'tailwindcss/base';\n@import 'tailwindcss/components';\n@import 'tailwindcss/utilities';\n`);
                
                // On copie le fichier de configuration de Tailwind CSS
                fs.writeFileSync(`${name}/tailwind.config.js`, `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} `)
                
            }

        } catch (err) {
            console.error(err);
        }
    });


program.parse(process.argv);