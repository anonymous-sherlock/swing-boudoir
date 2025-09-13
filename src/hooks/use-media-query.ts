import * as React from "react";

export function useMediaQuery(query: string) {
	const [value, setValue] = React.useState(() => {
		// Initialize with the actual value to prevent flash
		if (typeof window !== "undefined") {
			return matchMedia(query).matches;
		}
		return false;
	});

	React.useEffect(() => {
		function onChange(event: MediaQueryListEvent) {
			setValue(event.matches);
		}

		const result = matchMedia(query);
		result.addEventListener("change", onChange);
		setValue(result.matches);

		return () => result.removeEventListener("change", onChange);
	}, [query]);

	return value;
}
