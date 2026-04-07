# Sonar Cloud

Setting up Sonar Cloud

## Local

### VS Code

- Install the SonarQube for IDE extension
- Make sure you have a workspace set up and saved
- In the extension Panel open `Connected Mode` and click the [+] Icon next to `SonarQube Cloud` 
- Click on `Generate Token`
- Choose an organisation - (Probably `Catch Design (Unbound)`)
- Name the Connection
- Click Save Connection
- Click the [+] (add project binding) icon next to the connection
- Choose a project
- Problems will now appear in the bottom pane

### .vscode/settings.json

You can add this to the project `.vscode/settings.json` file

```json
{
  "sonarlint.connectedMode.project": {
    "connectionId": "catch-design",
    "projectKey": "catch-design_{{ PROJECT ID}}"
  }
}
```

### .sonarlint/connectedMode.json


You can add this to the project `.vscode/settings.json` file

```json
{
  "sonarCloudOrganization": "catch-design",
  "projectKey": "catch-design_standards"
}
```

## Github

The standards will add a github workflow that will connect to Sonar Cloud, this requires you to add a secrets to the repository

- Open https://sonarcloud.io/projects
- Select an existing project or add a new one see below for instruction on how to do that. **NB** This will most likely happen under the `Catch Design (Unbound)` organistion if you're using the team account
- Add the following [repo secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-encrypted-secrets-for-a-repository).
  - `SONAR_TOKEN`
    - Go the integrations screen for the project https://sonarcloud.io/project/configuration/GitHubActions?id={{ PROJECT ID}}
    - Copy the `SONAR_TOKEN`
  - `SONAR_ORGANIZATION` and `SONAR_PROJECT_KEY`
    - Go to the info screen https://sonarcloud.io/project/information?id={{ PROJECT ID}}
    - The organisation and project key will be there.

## Cloud Project setup

- Go to our unbound organisation https://sonarcloud.io/organizations/catch-design/projects
  - *NB* This is not linked to a specific github organisation so you can attach repos across systems to it. It's slightly annoying and requires more manual setup, but it is more flexible.
- If you need to make a new project do the following
  - Make project:
    - Go to https://sonarcloud.io/projects/create
    - Select `Catch Design (Not bound)`
    - Add a Name
    - Click Next
    - Select Compare previous version (you can change this later)
  - Choose default branch
    - Go to https://sonarcloud.io/project/branches_list?id={{ PROJECT ID}}
    - Define the default branch
    - Setup a long lived branch pattern: `(main|master|release/.*)`
  - Go to https://sonarcloud.io/project/ai_generated_code?id={{ PROJECT ID}}
    - Enable AI code assurance
    - Select Sonar way for AI Code

## sonar-project.properties

- This root level file (`sonar-project.properties`) is also available to configure the project, test locations etc, see https://docs.sonarsource.com/sonarqube-server/latest/analyzing-source-code/analysis-parameters/
