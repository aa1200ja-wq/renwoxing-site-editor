import { members as fallbackMembers } from "@/site/member-data";
import type {
  MemberCarouselData,
  MemberItem,
  MemberModalConfig,
  ViewportMode,
} from "./model";

const fallbackModal: Record<ViewportMode, MemberModalConfig> = {
  desktop: { width: 424, height: 565, fit: "contain" },
  mobile: { width: 330, height: 440, fit: "contain" },
};

function fallbackItems(): MemberItem[] {
  return fallbackMembers.map((member) => ({
    ...member,
    id: String(member.id),
  }));
}

export function defaultMemberCarouselData(): MemberCarouselData {
  return {
    members: fallbackItems(),
    modal: {
      desktop: { ...fallbackModal.desktop },
      mobile: { ...fallbackModal.mobile },
    },
  };
}

export function resolveMemberCarouselData(
  data?: MemberCarouselData,
): Required<MemberCarouselData> {
  return {
    members:
      data?.members && data.members.length
        ? data.members.map((member) => ({ ...member }))
        : fallbackItems(),
    modal: {
      desktop: {
        ...fallbackModal.desktop,
        ...(data?.modal?.desktop ?? {}),
      },
      mobile: {
        ...fallbackModal.mobile,
        ...(data?.modal?.mobile ?? {}),
      },
    },
  };
}

export function memberModalFor(
  data: MemberCarouselData | undefined,
  viewport: ViewportMode,
) {
  return resolveMemberCarouselData(data).modal[viewport];
}
