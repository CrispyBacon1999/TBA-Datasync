import { useEffect, useState } from "react";
import { Button, Form, Input, TextArea } from "semantic-ui-react";

export default function Teams() {
    const [teams, setTeams] = useState<string[]>([]);
    const [teamInputData, setTeamInputData] = useState<string>("");

    useEffect(() => {
        fetch("/api/teams")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                const teamsNumeric = data
                    .map((team: string) => {
                        return parseInt(team.replace("frc", ""));
                    })
                    .sort((a: number, b: number) => a - b);

                console.log(teamsNumeric);
                setTeams(data);
                setTeamInputData(teamsNumeric.join("\n"));
            });
    }, []);

    const handleChange = async () => {
        console.log(teamInputData);
        const teamList = teamInputData.split("\n").map((team) => {
            console.log(team);
            return team.trim();
        });

        console.log(teamList);

        const res = await fetch("/api/teams", {
            method: "POST",
            body: JSON.stringify(teamList),
        });

        console.log(res);
    };

    return (
        <div>
            <h1>Team list</h1>
            <Form>
                <TextArea
                    placeholder="Team numbers"
                    value={teamInputData}
                    onChange={(event) => setTeamInputData(event.target.value)}
                    rows={40}
                ></TextArea>
            </Form>
            <Button onClick={handleChange}>Change Teams</Button>
        </div>
    );
}
