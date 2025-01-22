const AppSidebarHeader = () => {
    return (
      <SidebarHeader>
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 pl-2">
            <img
              src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
              alt="BARK Logo"
              className="h-8 w-8"
            />
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-lg font-bold leading-none">BARK</span>
              <span className="font-inter font-semibold text-xs text-muted-foreground">AI Chatbot</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <div className="flex items-center gap-1.5 group-data-[collapsible=icon]:hidden">
              {IS_BETA && (
                <span className="select-none rounded-md bg-primary/90 px-1.5 py-0.5 text-xs text-primary-foreground">
                  BETA
                </span>
              )}
              <span className="select-none rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                {APP_VERSION}
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>
    )
  }
  