function getJournal(logs) {
    let journal = {},
        currentDay = null,
        lastIn = null;

    for (let log of logs) {
        currentDay = log.createdAt.toLocaleDateString(
            "en-ZA", // yyyy/MM/dd
            {
                year: "numeric",
                month: "2-digit",
                day: "numeric"
            }
        );

        if (!journal[currentDay]) {
            journal[currentDay] = {
                logs: [],
                hours: 0
            };
            lastIn = null;
        }

        journal[currentDay].logs.push(log);

        if (log.type == 'in') {
            lastIn = log.createdAt;
        } else {
            journal[currentDay].hours += (log.createdAt.getTime() - lastIn.getTime()) / 3600000;
        }
    }

    return journal;
}

function getHours(logs) {
    let hours = 0;

    for (let log of logs) {

        if (log.type == 'in') {
            lastIn = log.createdAt;
        } else {
            hours += (log.createdAt.getTime() - lastIn.getTime()) / 3600000;
        }
    }

    return hours;
}

module.exports = {
    getJournal,
    getHours
};