<template>
    <div>
        <UiCommandDialog v-model:open="localModel">
            <UiDialogTitle class="sr-only">Doumnetation search modal</UiDialogTitle>
            <UiDialogDescription class="sr-only">
                Search the documentation for components, utilities, and more.
            </UiDialogDescription>

            <UiCommandInput placeholder="Search..." />

            <UiCommandList>
                <UiScrollArea class="h-[300px] w-full">
                    <UiCommandEmpty>No results found.</UiCommandEmpty>
                    <template v-for="(nav, i) in navigation" :key="i">
                        <UiCommandGroup :heading="nav.title">
                            <UiCommandItem v-for="(child, k) in nav.children" :key="k" class="px-4 py-2 first:mt-2"
                                :value="child.title" @select="
            $event.preventDefault();
        navigateTo(child._path);
        localModel = false;
        ">
                                <Icon :name="nav.icon" class="h-4 w-4 text-muted-foreground/80" />
                                <span>{{ child.title }}</span>
                                <UiBadge v-if="child.label" class="ml-4 px-2 py-0 text-[10px] dark:bg-lime-500">{{
            child.label
        }}</UiBadge>
                            </UiCommandItem>
                        </UiCommandGroup>
                    </template>
                    <UiCommandGroup heading="Theme">
                        <UiCommandItem v-for="(mode, i) in modes" :key="i" class="px-4 py-2 first:mt-2"
                            :value="mode.value" @select="setTheme($event, mode.value)">
                            <Icon :name="mode.icon" class="h-4 w-4 text-muted-foreground/80" />
                            <span>{{ mode.title }}</span>
                        </UiCommandItem>
                    </UiCommandGroup>
                </UiScrollArea>
            </UiCommandList>
        </UiCommandDialog>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    modelValue?: boolean;
}>();
const modes = [
    { icon: "lucide:sun", title: "Light", value: "light" },
    { icon: "lucide:moon", title: "Dark", value: "dark" },
    { icon: "lucide:laptop", title: "System", value: "system" },
];

const emits = defineEmits<{
    "update:modelValue": [value: boolean];
}>();
const localModel = useVModel(props, "modelValue", emits, { passive: true });

// const { navigation } = useContent();

const navigation = ref([
    {
        title: "Getting Started",
        icon: "lucide:book-open",
        children: [
            {
                title: "Introduction",
                _path: "/docs/introduction",
                label: "New"
            },
            {
                title: "Installation",
                _path: "/docs/installation"
            }
        ]
    },
    {
        title: "Features",
        icon: "lucide:box",
        children: [
            {
                title: "Laporan",
                _path: ""
            },
            {
                title: "Pembelian",
                _path: ""
            }
        ]
    },
    {
        title: "API Reference",
        icon: "lucide:code",
        children: [
            {
                title: "useFetch",
                _path: "/docs/api/use-fetch"
            },
            {
                title: "useAsyncData",
                _path: "/docs/api/use-async-data"
            }
        ]
    }
]);


const navigateTo = (path: string) => {
    navigateTo(path);
};
console.log("navigation", navigation);
const colorMode = useColorMode();
const setTheme = (e: Event, val: string) => {
    e.preventDefault();
    colorMode.preference = val;
    localModel.value = false;
};
</script>
