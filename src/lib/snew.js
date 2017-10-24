export const proposalToT3 = ({
  name, timestamp, censorshiprecord = {}
}, idx) => ({
  kind: "t3",
  data: {
    rank: idx + 1,
    title: name,
    id: censorshiprecord.token,
    name: "t3_"+censorshiprecord.token,
    created_utc: timestamp,
    permalink: `/proposals/${censorshiprecord.token}/`,
    url: `/proposals/${censorshiprecord.token}/`,
    is_self: true
  }
});
