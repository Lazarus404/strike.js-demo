import { useState } from '../../vendor/strike.core+hooks.js';
import { Btn, Stack, Text } from '../../vendor/strike-ui.js';
import { Progress } from 'strike-fw-ui';
import {
	createQueryClient,
	useQueryGroup
} from 'strike-fw-store/query';

const client = createQueryClient();

function delay(ms) {
	return new Promise(function (resolve) {
		setTimeout(resolve, ms);
	});
}

export function StorePlayground() {
	const group = useQueryGroup(client, 'lab-fetch');
	const [last, setLast] = useState('');

	function runFetch(report) {
		client
			.run(
				'lab-fetch',
				async function (ctx) {
					for (let step = 1; step <= 5; step++) {
						await delay(120);
						if (report) ctx.reportProgress(step / 5);
					}
					return { at: Date.now() };
				},
				{
					key: 'demo',
					onSuccess: function (data) {
						setLast('Done at ' + data.at);
					}
				}
			)
			.catch(function () {});
	}

	return (
		<Stack gap={16} class="lab-store">
			<Text>
				Query groups stack Promise work and expose pending / progress for UI.
			</Text>
			<Stack row gap={8}>
				<Btn onClick={() => runFetch(true)}>Run with progress</Btn>
				<Btn variant="ghost" onClick={() => runFetch(false)}>
					Run indeterminate
				</Btn>
				<Btn variant="ghost" onClick={() => client.cancel('lab-fetch')}>
					Cancel
				</Btn>
			</Stack>
			{group.pending > 0 ? (
				group.progress == null ? (
					<Progress label="Fetching" />
				) : (
					<Progress
						label="Fetching"
						value={Math.round(group.progress * 100)}
					/>
				)
			) : null}
			<Text tone="muted">
				Status: {group.status}
				{group.pending ? ' (' + group.pending + ' pending)' : ''}
			</Text>
			{last ? <Text>{last}</Text> : null}
		</Stack>
	);
}
