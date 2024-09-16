#!/usr/bin/env node

import { program } from 'commander';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

program
    .version('0.0.1')
    .command('create')
    .description('Create a new Angular project using my custom template')
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
                }
            ]);

            // On créer l'application Angular
            execSync(`npx @angular/cli new ${name}`, { stdio: 'inherit' });
            if(tailwind) {
                // On installe Tailwind CSS
                execSync(`cd ${name} && npm install tailwindcss`, { stdio: 'inherit' });

                // On génère le fichier de configuration de Tailwind CSS
                execSync(`cd ${name} && npx tailwindcss init`, { stdio: 'inherit' });

                // On ajoute Tailwind CSS au fichier de styles
                execSync(`cd ${name} && npx tailwindcss build src/styles.css -o src/styles.css`, { stdio: 'inherit' });
            }

        } catch (err) {
            console.error(err);
        }
    });


program.parse(process.argv);