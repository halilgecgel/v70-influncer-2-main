"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Image, 
  FileText, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Activity,
  UserCheck,
  Globe,
  Palette,
  Database
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
  currentUser: any
}

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Genel istatistikler"
  },
  {
    id: "influencers",
    label: "Influencerlar",
    icon: Users,
    description: "Influencer yönetimi"
  },
  {
    id: "brands",
    label: "Markalar",
    icon: Building2,
    description: "Marka yönetimi"
  },
  {
    id: "slider",
    label: "Slider",
    icon: Image,
    description: "Ana sayfa slider"
  },
  {
    id: "about",
    label: "Hakkımızda",
    icon: FileText,
    description: "Hakkımızda içerikleri"
  },
  {
    id: "logs",
    label: "Loglar",
    icon: Activity,
    description: "Sistem logları"
  },
  {
    id: "analytics",
    label: "Analitik",
    icon: BarChart3,
    description: "Detaylı analitikler"
  },
  {
    id: "followers",
    label: "Takipçi Sorgu",
    icon: UserCheck,
    description: "Takipçi sorgulama"
  },
  {
    id: "meta",
    label: "Meta Ayarları",
    icon: Globe,
    description: "SEO ve meta ayarları"
  },
  {
    id: "theme",
    label: "Tema Ayarları",
    icon: Palette,
    description: "Görsel ayarlar"
  },
  {
    id: "database",
    label: "Veritabanı",
    icon: Database,
    description: "Veritabanı yönetimi"
  },
  {
    id: "settings",
    label: "Genel Ayarlar",
    icon: Settings,
    description: "Sistem ayarları"
  }
]

export function AdminSidebar({ 
  isCollapsed, 
  onToggle, 
  activeTab, 
  onTabChange, 
  onLogout,
  currentUser 
}: SidebarProps) {
  return (
    <div className={cn(
      "flex flex-col bg-gray-800 border-r border-gray-700 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-white font-semibold">Admin Panel</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-gray-400 hover:text-white hover:bg-gray-700"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* User Info */}
      {!isCollapsed && currentUser && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {currentUser.full_name?.charAt(0) || currentUser.username?.charAt(0) || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {currentUser.full_name || currentUser.username}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {currentUser.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto py-3 px-3",
                  activeTab === item.id 
                    ? "bg-green-600 text-white hover:bg-green-700" 
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <div className="ml-3 text-left">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                )}
              </Button>
            )
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className="w-full text-red-400 hover:text-red-300 hover:bg-red-900/20"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Çıkış Yap</span>}
        </Button>
      </div>
    </div>
  )
}
